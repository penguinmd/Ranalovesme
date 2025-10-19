import { VercelResponse } from '@vercel/node';
import { AuthRequest, authenticateToken } from '../../lib/auth';
import { sql } from '../../lib/db';

// Ensure body parser is enabled
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

async function handler(req: AuthRequest, res: VercelResponse) {
  // Parse body if it's not already parsed (for POST/PUT)
  if (req.method === 'POST' || req.method === 'PUT') {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid JSON' });
      }
    }
  }
  if (req.method === 'GET') {
    // Get all days or stats
    if (req.query.stats === 'true') {
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

    // Get all days
    try {
      const result = await sql`
        SELECT * FROM days_together
        ORDER BY date DESC
      `;
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Get days error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    // Create a new day
    try {
      const { date, title, description, mood, rating } = req.body;

      if (!date) {
        return res.status(400).json({ message: 'Date is required' });
      }

      const result = await sql`
        INSERT INTO days_together (date, title, description, mood, rating, created_by)
        VALUES (${date}, ${title || null}, ${description || null}, ${mood || null}, ${rating || null}, ${req.user!.id})
        RETURNING id
      `;

      return res.status(201).json({ id: result.rows[0].id, message: 'Day created successfully' });
    } catch (error: any) {
      console.error('Create day error:', error);
      if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
        return res.status(400).json({ message: 'A day already exists for this date' });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default authenticateToken(handler);
