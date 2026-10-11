// api/claude.js — Vercel serverless function (Node runtime)
// Mirror of netlify/functions/claude.js for Vercel deployments.

const ALLOWED_MODELS = new Set([
  'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-20241022',
]);

const ipHits = new Map();
const WINDOW_MS = 60_000;
const MAX_REQ = 20;

function rateLimited(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip) || { count: 0, reset: now + WINDOW_MS };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + WINDOW_MS; }
  entry.count++;
  ipHits.set(ip, entry);
  return entry.count > MAX_REQ;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Rate limit exceeded.' });

  const body = req.body || {};
  const model = body.model || 'claude-sonnet-4-20250514';
  if (!ALLOWED_MODELS.has(model)) return res.status(400).json({ error: 'Model not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY' });

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: Math.min(body.max_tokens || 1000, 2000),
        messages: body.messages,
        ...(body.system && { system: body.system }),
        ...(body.tools  && { tools:  body.tools  }),
      }),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Upstream failure: ' + err.message });
  }
}

export const config = { runtime: 'nodejs' };