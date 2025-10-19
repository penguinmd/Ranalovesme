import { VercelResponse } from '@vercel/node';
import { AuthRequest, authenticateToken } from '../../lib/auth';
import { sql } from '../../lib/db';

async function handler(req: AuthRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await sql`
      SELECT
        COUNT(*) as total_days,
        MIN(date) as first_day,
        MAX(date) as last_day,
        AVG(rating) as average_rating
      FROM days_together
    `;

    const stats = result.rows[0];
    return res.status(200).json({
      total_days: parseInt(stats.total_days),
      first_day: stats.first_day,
      latest_day: stats.last_day,
      average_rating: parseFloat(stats.average_rating) || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authenticateToken(handler);
