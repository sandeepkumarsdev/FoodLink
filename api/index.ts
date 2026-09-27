export default async function handler(req: any, res: any) {
  try {
    const { default: app } = await import('../backend/server');
    return app(req, res);
  } catch (err: any) {
    console.error('CRITICAL SERVERLESS STARTUP ERROR:', err);
    res.status(500).json({
      error: 'Backend failed to start on Vercel',
      message: err.message,
      stack: err.stack
    });
  }
}
