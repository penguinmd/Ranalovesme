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
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid day ID' });
  }

  const dayId = parseInt(id);

  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT * FROM days_together
        WHERE id = ${dayId}
      `;

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Day not found' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Get day error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      // Parse body if it's not already parsed
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid JSON' });
        }
      }

      const { title, description, mood, rating } = body;

      await sql`
        UPDATE days_together
        SET title = ${title || null},
            description = ${description || null},
            mood = ${mood || null},
            rating = ${rating || null},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${dayId}
      `;

      return res.status(200).json({ message: 'Day updated successfully' });
    } catch (error) {
      console.error('Update day error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await sql`
        DELETE FROM days_together
        WHERE id = ${dayId}
      `;

      return res.status(200).json({ message: 'Day deleted successfully' });
    } catch (error) {
      console.error('Delete day error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default authenticateToken(handler);
