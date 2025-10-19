import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends VercelRequest {
  user?: {
    id: number;
    username: string;
  };
}

export function authenticateToken(handler: (req: AuthRequest, res: VercelResponse) => Promise<void>) {
  return async (req: AuthRequest, res: VercelResponse) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
}

export function generateToken(user: { id: number; username: string }): string {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}
