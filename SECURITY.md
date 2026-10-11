# Security Policy

## ⚠️ Important — Medical & Privacy Notice

QuantumMed is a **demonstration / research project**. It must **not** be used
with real patient data in production without a full HIPAA / GDPR compliance
review, encryption at rest, authentication, and audit logging.

## Supported versions

| Version      | Supported |
| ------------ | --------- |
| main branch  | ✅        |
| Older tags   | ❌        |

## Reporting a vulnerability

Please **do not** open a public issue. Email **dhruvoberoi@example.com**
with:

- Description of the issue
- Steps to reproduce
- Potential impact

You should receive a response within 72 hours.

## Known limitations

- The Claude API call is routed through a serverless proxy
  (`netlify/functions/claude.js`). The API key is stored server-side as an
  environment variable and never exposed to the browser.
- The Gradio bridge posts over plain HTTP — use HTTPS in production.
- No authentication layer is present. Do not deploy publicly with real data.
- The in-memory rate limiter resets on cold start; swap for Redis in
  production.