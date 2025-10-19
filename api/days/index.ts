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
      // Parse body if it's not already parsed
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          console.error('JSON parse error:', e);
          return res.status(400).json({ message: 'Invalid JSON', error: String(e) });
        }
      }

      console.log('Received body:', JSON.stringify(body));
      console.log('Body type:', typeof body);

      const { date, title, description, mood, rating } = body;

      console.log('Parsed fields:', { date, title, description, mood, rating });

      if (!date) {
        return res.status(400).json({
          message: 'Date is required',
          receivedBody: body,
          dateValue: date
        });
      }

      console.log('About to insert into database:', { date, title, description, mood, rating, created_by: req.user!.id });

      const result = await sql`
        INSERT INTO days_together (date, title, description, mood, rating, created_by)
        VALUES (${date}, ${title || null}, ${description || null}, ${mood || null}, ${rating || null}, ${req.user!.id})
        RETURNING id
      `;

      console.log('Insert successful, returning:', result.rows[0]);
      return res.status(201).json({ id: result.rows[0].id, message: 'Day created successfully' });
    } catch (error: any) {
      console.error('Create day error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        stack: error.stack
      });
      if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
        return res.status(400).json({ message: 'A day already exists for this date', error: error.message });
      }
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
        detail: error.detail
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default authenticateToken(handler);
