import { VercelResponse } from '@vercel/node';
import { AuthRequest, authenticateToken } from '../../../lib/auth';
import { sql } from '../../../lib/db';

async function handler(req: AuthRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid day ID' });
  }

  const dayId = parseInt(id as string);

  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT p.*
        FROM photos p
        INNER JOIN day_photos dp ON p.id = dp.photo_id
        WHERE dp.day_id = ${dayId}
        ORDER BY p.created_at DESC
      `;

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Get day photos error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default authenticateToken(handler);
