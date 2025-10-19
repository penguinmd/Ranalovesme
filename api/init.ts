import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDatabase, setupDefaultUsers } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Simple auth check - use a secret token
  const { secret } = req.body;

  // Debug logging
  console.log('Received secret:', secret?.substring(0, 10) + '...');
  console.log('Expected secret:', process.env.INIT_SECRET?.substring(0, 10) + '...');
  console.log('Secrets match:', secret === process.env.INIT_SECRET);
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', Object.keys(req.body || {}));

  if (secret !== process.env.INIT_SECRET) {
    return res.status(401).json({
      message: 'Unauthorized',
      debug: {
        receivedLength: secret?.length,
        expectedLength: process.env.INIT_SECRET?.length,
        receivedPreview: secret?.substring(0, 10),
        expectedPreview: process.env.INIT_SECRET?.substring(0, 10)
      }
    });
  }

  try {
    // Initialize database schema
    await initializeDatabase();

    // Setup default users
    await setupDefaultUsers();

    return res.status(200).json({
      success: true,
      message: 'Database initialized and default users created'
    });
  } catch (error) {
    console.error('Initialization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
