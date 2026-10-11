# QuantumMed — Architecture

## High-level overview

QuantumMed is a **single-page, single-file browser application** with a
thin **serverless backend** for API-key security. There is no framework,
no build step, and no persistent database — everything runs in the browser
except the Claude API call, which is proxied to keep the key secret.

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (index.html)                  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Risk Engine  │  │ Claude AI    │  │ R Analytics   │  │
│  │ (JS quantum  │  │ (chat +      │  │ (Chart.js +   │  │
│  │  simulator)  │  │  web search) │  │  stats)       │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                 │                  │          │
│         └────────┬────────┴──────────────────┘          │
│                  ▼                                       │
│         ┌────────────────────┐  ┌──────────────────┐    │
│         │ /api/claude proxy  │  │ health_data.json │    │
│         │ (serverless fn)    │  │ (R output)       │    │
│         └─────────┬──────────┘  └──────────────────┘    │
└───────────────────┼───────────────────────┬─────────────┘
                    ▼                       ▼
          ┌──────────────────┐    ┌──────────────────┐
          │  Anthropic API   │    │  Overpass API    │
          │  (Claude 4)      │    │  (OSM hospitals) │
          └──────────────────┘    └──────────────────┘
                                          ▲
                                          │ HTTP POST
                                 ┌────────┴─────────┐
                                 │  ESP32 / Arduino │
                                 │  WiFi sensor     │
                                 └──────────────────┘
```

## Components

### 1. Frontend (`index.html`)

Single HTML file containing all CSS and JavaScript inline. Organized into
five logical tabs:

- **Risk Predictor** — collects patient parameters, runs a JS quantum
  circuit simulator, computes 6-disease risk scores, requests a Claude
  clinical interpretation.
- **AI Assistant** — chat interface with topic shortcuts, patient-context
  injection, and live web search via Claude's `web_search` tool.
- **R Analytics** — reads `health_data.json`, renders Chart.js trends,
  computes Pearson correlations, and drives the Gradio ML bridge.
- **Hospitals** — geolocation → Leaflet map → Overpass API query → facility
  list → directions via Google Maps deep links.
- **WiFi Monitor** — simulated ESP32 device discovery, live sensor gauges,
  CSV/JSON export, Gradio ML prediction.

### 2. Serverless proxy (`netlify/functions/claude.js`)

Node.js ESM function deployed as `/api/claude`:

- Injects `ANTHROPIC_API_KEY` from env
- Validates model against allow-list
- Caps `max_tokens` at 2000
- IP-based rate limiting (20 req/min)
- Returns Anthropic's response verbatim

Mirror exists at `api/claude.js` for Vercel deployments.

### 3. External services

| Service | Purpose | Auth |
|---|---|---|
| Anthropic API | LLM reasoning + web search | Server-side API key |
| Overpass API | Nearby hospitals / clinics / pharmacies | None (public) |
| OpenStreetMap tiles | Map rendering | None (public) |
| Gradio Space | Custom ML risk classifier | None (public endpoint) |
| ipapi.co | IP-based geolocation fallback | None (public) |

### 4. Data flow — patient risk analysis

1. User fills form → `getFormData()`
2. `computeRisks()` runs client-side scoring
3. `simulateQuantumMetrics()` fabricates circuit stats
4. `callClaude()` → POST `/api/claude`
5. Proxy → Anthropic → returns clinical narrative
6. Narrative rendered in `#aiAnalysis`
7. History saved to in-memory array

### 5. Data flow — R analytics

1. `loadRData()` fetches `/health_data.json`
2. On failure, `generateDemoRData()` synthesizes 60 records
3. `renderRDashboard()` updates all charts, tables, statistics
4. Auto-refresh every 5 s (toggle in UI)

## Performance considerations

- **Zero build step** — instant cold start, works offline (except AI)
- **Lazy map loading** — Leaflet loaded only when Hospitals tab is opened
- **Chart.js destroyed + recreated** on each render to avoid memory leaks
- **Debounced auto-refresh** — R data refreshes at most every 5 s

## Security model

- API key only exists server-side as env var
- No user authentication (intentional — demo app)
- Rate limiting protects against abuse
- Model allow-list prevents cost escalation

## Known limitations

- Demo hospitals are placeholder names (see `generateDemoHospitals()`)
- Quantum "simulation" is a JS heuristic, not a real quantum computer
- No persistence — all data lives in browser memory per session
- Rate limiter is per-instance, resets on Netlify cold start

## Future work

- Real R script + Plumber API for live stats
- Web Bluetooth for BLE medical devices
- Web Serial for wired pulse oximeters
- End-to-end encryption for patient data
- HIPAA / GDPR compliance review
- Multi-language support (i18n)