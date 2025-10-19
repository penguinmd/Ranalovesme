import { VercelResponse } from '@vercel/node';
import { AuthRequest, authenticateToken } from '../../../../lib/auth';
import { sql } from '../../../../lib/db';

async function handler(req: AuthRequest, res: VercelResponse) {
  const { id, photoId } = req.query;

  if (!id || Array.isArray(id) || !photoId || Array.isArray(photoId)) {
    return res.status(400).json({ message: 'Invalid IDs' });
  }

  const dayId = parseInt(id);
  const pId = parseInt(photoId);

  if (req.method === 'POST') {
    try {
      await sql`
        INSERT INTO day_photos (day_id, photo_id)
        VALUES (${dayId}, ${pId})
        ON CONFLICT DO NOTHING
      `;

      return res.status(200).json({ message: 'Photo added to day successfully' });
    } catch (error) {
      console.error('Add photo to day error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await sql`
        DELETE FROM day_photos
        WHERE day_id = ${dayId} AND photo_id = ${pId}
      `;

      return res.status(200).json({ message: 'Photo removed from day successfully' });
    } catch (error) {
      console.error('Remove photo from day error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default authenticateToken(handler);
