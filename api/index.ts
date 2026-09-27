export default function handler(req: any, res: any) {
  res.status(401).json({ error: "HELLO FROM VERCEL! If you see this JSON, the Serverless Function works!" });
}
