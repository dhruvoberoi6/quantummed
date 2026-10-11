// netlify/functions/claude.js
// Server-side proxy for the Anthropic Claude API.
// Keeps ANTHROPIC_API_KEY out of the browser bundle.

const ALLOWED_MODELS = new Set([
  'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-20241022',
]);

// ── Naive in-memory rate limiter (resets on cold start) ──
// Good enough for a portfolio demo. For real traffic, swap for Upstash Redis.
const ipHits = new Map();
const WINDOW_MS = 60_000;
const MAX_REQ   = 20;

function rateLimited(ip) {
  const now   = Date.now();
  const entry = ipHits.get(ip) || { count: 0, reset: now + WINDOW_MS };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + WINDOW_MS; }
  entry.count++;
  ipHits.set(ip, entry);
  return entry.count > MAX_REQ;
}

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (status, obj) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

export default async (req, context) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST')    return json(405, { error: 'Method not allowed' });

  // ── Rate limit ──
  const ip = context.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return json(429, { error: 'Rate limit exceeded. Try again in a minute.' });
  }

  // ── Parse + validate ──
  let body;
  try { body = await req.json(); }
  catch { return json(400, { error: 'Invalid JSON body' }); }

  const model = body.model || 'claude-sonnet-4-20250514';
  if (!ALLOWED_MODELS.has(model)) return json(400, { error: 'Model not allowed' });

  const maxTokens = Math.min(body.max_tokens || 1000, 2000);

  // ── Auth ──
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json(500, { error: 'Server misconfigured: missing ANTHROPIC_API_KEY' });

  // ── Forward to Anthropic ──
  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages:   body.messages,
        ...(body.system && { system: body.system }),
        ...(body.tools  && { tools:  body.tools  }),
      }),
    });

    const data = await upstream.json();
    return json(upstream.status, data);

  } catch (err) {
    return json(502, { error: 'Upstream failure: ' + err.message });
  }
};

export const config = { path: '/api/claude' };