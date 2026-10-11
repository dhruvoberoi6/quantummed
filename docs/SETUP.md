# QuantumMed — Setup Guide

## Local development

```bash
git clone https://github.com/YOUR-USERNAME/quantummed.git
cd quantummed
npm install -g netlify-cli     # one-time
netlify dev                    # serves frontend + functions on :8888
```

Then open **http://localhost:8888**.

Set your key locally (never commit it):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
netlify dev
```

On Windows PowerShell:

```powershell
$env:ANTHROPIC_API_KEY="sk-ant-..."
netlify dev
```

## Deployment

### Netlify (recommended)

1. Push repo to GitHub
2. [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
3. Netlify auto-reads `netlify.toml` — accept defaults
4. **Site configuration → Environment variables → Add**:
   - `ANTHROPIC_API_KEY` = `sk-ant-...`
5. **Deploys → Trigger deploy → Clear cache and deploy site**

### Vercel

1. Push repo to GitHub
2. [vercel.com/new](https://vercel.com/new) → import repo
3. Vercel auto-detects `api/claude.js`
4. Add env var `ANTHROPIC_API_KEY` in **Project → Settings → Environment Variables**
5. Deploy

### GitHub Pages (AI features will NOT work)

GitHub Pages only serves static files — no serverless functions. The AI tabs will return `401` on every call. Use Netlify or Vercel instead.

## Getting an API key

1. Go to https://console.anthropic.com
2. **API Keys** → **Create Key**
3. **Billing** → add credits (start with **$5**)
4. **Billing → Limits** → set monthly spend cap to **$5**

## Troubleshooting

| Symptom | Fix |
|---|---|
| `401 Unauthorized` | Env var not set / misspelled. Recheck `ANTHROPIC_API_KEY` in Netlify. |
| `429 Rate limit exceeded` | Wait 60 s. Bump `MAX_REQ` in `claude.js` if it's your own IP. |
| `502 Upstream failure` | Anthropic API is down, or your key lacks access to the model. |
| AI works but map doesn't | Browser blocked geolocation on `http://`. Use HTTPS. |
| `Cannot find module` in function logs | `package.json` must have `"type": "module"`. |
| `netlify dev` command not found | `npm install -g netlify-cli` then reopen terminal. |
| Location prompt never appears | You're on `http://` instead of `https://`. Netlify gives HTTPS automatically. |