import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log raw body type
    console.log('Body type:', typeof req.body);
    console.log('Body value:', req.body);

    const { username, password } = req.body;

    return res.status(200).json({
      message: 'Test successful',
      receivedUsername: username,
      receivedPassword: password ? '***' : undefined
    });
  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
