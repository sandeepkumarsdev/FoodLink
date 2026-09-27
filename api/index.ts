import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Dynamically import the Express app to catch any top-level initialization errors
    const { default: app } = await import('../backend/server');
    return app(req, res);
  } catch (err: any) {
    console.error('CRITICAL SERVERLESS STARTUP ERROR:', err);
    // Return a JSON response with the exact error so the frontend can display it
    res.status(500).json({
      error: 'Backend failed to start on Vercel',
      message: err.message,
      stack: err.stack
    });
  }
}
