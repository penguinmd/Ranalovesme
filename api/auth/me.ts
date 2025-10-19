import { VercelResponse } from '@vercel/node';
import { AuthRequest, authenticateToken } from '../../lib/auth';
import { sql } from '../../lib/db';

async function handler(req: AuthRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await sql`
      SELECT id, username, display_name, created_at
      FROM users
      WHERE id = ${req.user!.id}
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default authenticateToken(handler);
