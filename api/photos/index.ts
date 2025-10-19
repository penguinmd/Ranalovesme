import { VercelResponse } from '@vercel/node';
import { AuthRequest, authenticateToken } from '../../lib/auth';
import { sql } from '../../lib/db';
import { put } from '@vercel/blob';
import { IncomingForm } from 'formidable';
import * as fs from 'fs';

// Disable bodyParser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: AuthRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT * FROM photos
        ORDER BY created_at DESC
      `;
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Get photos error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      // Parse multipart form data
      const form = new IncomingForm();

      const { fields, files } = await new Promise<any>((resolve, reject) => {
        form.parse(req as any, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;
      const caption = Array.isArray(fields.caption) ? fields.caption[0] : fields.caption;
      const location = Array.isArray(fields.location) ? fields.location[0] : fields.location;
      const taken_date = Array.isArray(fields.taken_date) ? fields.taken_date[0] : fields.taken_date;

      if (!photoFile) {
        return res.status(400).json({ message: 'Photo file is required' });
      }

      // Read file and upload to Vercel Blob
      const fileBuffer = fs.readFileSync(photoFile.filepath);
      const timestamp = Date.now();
      const filename = `${timestamp}-${photoFile.originalFilename || 'photo.jpg'}`;

      const blob = await put(filename, fileBuffer, {
        access: 'public',
      });

      // Save to database
      const result = await sql`
        INSERT INTO photos (filename, original_name, caption, location, taken_date, uploaded_by)
        VALUES (${blob.url}, ${photoFile.originalFilename || 'photo.jpg'}, ${caption || null}, ${location || null}, ${taken_date || null}, ${req.user!.id})
        RETURNING id, filename, original_name, caption, location, taken_date, created_at
      `;

      // Clean up temp file
      fs.unlinkSync(photoFile.filepath);

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Upload photo error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default authenticateToken(handler);
