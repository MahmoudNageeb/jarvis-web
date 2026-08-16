import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const port = req.query.port as string;
  if (!port) return res.status(400).json({ ok: false });

  try {
    // فحص المنفذ عبر الـ gateway الداخلي (نفس السيرفر)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const r = await fetch(`http://localhost:${port}/`, { method: 'GET', signal: controller.signal });
    clearTimeout(timeout);
    res.status(200).json({ ok: r.status < 500 });
  } catch {
    res.status(200).json({ ok: false });
  }
}
