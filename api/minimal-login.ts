import { VercelRequest, VercelResponse } from '@vercel/node';

// Ensure body parser is enabled
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Parse body if it's not already parsed
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid JSON in request body' });
    }
  }

  const { username, password } = body;

  return res.status(200).json({
    message: 'Success!',
    username,
    hasPassword: !!password
  });
}
