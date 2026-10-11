# QuantumMed API Reference

## POST `/api/claude`

Serverless proxy to the Anthropic Claude Messages API.
Keeps the API key server-side. Used by the AI Assistant, Risk Predictor,
and appointment-booking flows.

### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "messages": [
    { "role": "user", "content": "What are signs of high blood sugar?" }
  ],
  "system": "Optional system prompt string",
  "tools": [
    { "type": "web_search_20250305", "name": "web_search", "max_uses": 3 }
  ]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `model` | string | No | Defaults to `claude-sonnet-4-20250514`. Must be in `ALLOWED_MODELS`. |
| `max_tokens` | number | No | Defaults to 1000. Capped at 2000. |
| `messages` | array | Yes | Anthropic Messages format. |
| `system` | string | No | System prompt. |
| `tools` | array | No | Anthropic tool definitions. |

### Response

Passthrough of Anthropic's response — same schema as the upstream API.
Success (`200`):

```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "content": [{ "type": "text", "text": "..." }],
  "model": "claude-sonnet-4-20250514",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 42, "output_tokens": 187 }
}
```

### Error responses

| Status | Body | Meaning |
|---|---|---|
| `400` | `{ "error": "Invalid JSON body" }` | Malformed request body |
| `400` | `{ "error": "Model not allowed" }` | Requested model not in allow-list |
| `405` | `{ "error": "Method not allowed" }` | Non-POST method |
| `429` | `{ "error": "Rate limit exceeded..." }` | More than 20 requests/min from same IP |
| `500` | `{ "error": "Server misconfigured..." }` | `ANTHROPIC_API_KEY` env var not set |
| `502` | `{ "error": "Upstream failure: ..." }` | Anthropic API unreachable |

### Rate limiting

- **Limit:** 20 requests / minute / IP address
- **Storage:** In-memory `Map` (resets on cold start)
- **Upgrade path:** Replace with Upstash Redis or Cloudflare KV for production

### Security

- API key never exposed to the client
- CORS allows any origin by default (`*`) — tighten in production
- Model allow-list: `claude-sonnet-4-20250514`, `claude-3-5-sonnet-20241022`
- Max tokens capped at 2000 per request

### Example — curl

```bash
curl -X POST https://YOUR-SITE.netlify.app/api/claude \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 500,
    "messages": [{ "role": "user", "content": "Hello" }]
  }'
```

### Example — JavaScript

```js
const res = await fetch('/api/claude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'What is BMI?' }]
  })
});
const data = await res.json();
console.log(data.content[0].text);
```