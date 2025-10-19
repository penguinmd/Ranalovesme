import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    hasInitSecret: !!process.env.INIT_SECRET,
    initSecretLength: process.env.INIT_SECRET?.length || 0,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    nodeEnv: process.env.NODE_ENV,
  });
}
