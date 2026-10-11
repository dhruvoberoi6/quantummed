<div align="center">

# ⚛ QuantumMed

### Disease Risk Prediction & AI Health Assistant

**Quantum-assisted early disease risk stratification for emergency healthcare systems**

[![SDG 3](https://img.shields.io/badge/UN%20SDG-3%20Good%20Health-00ff9f?style=flat-square)](https://sdgs.un.org/goals/goal3)
[![License: MIT](https://img.shields.io/badge/License-MIT-00d4ff.svg?style=flat-square)](LICENSE)
[![Made with Claude](https://img.shields.io/badge/AI-Claude%20Sonnet-7c3aed?style=flat-square)](https://anthropic.com)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js%204.x-f59e0b?style=flat-square)](https://chartjs.org)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet%201.9-00ff9f?style=flat-square)](https://leafletjs.com)

[Features](#-features) · [Quick Start](#-quick-start) · [Architecture](#-architecture) · [Contributing](#-contributing)

</div>

---

## 🌍 About

**QuantumMed** is a browser-based health intelligence platform that combines **quantum-circuit simulation**, **large-language-model clinical reasoning**, and **real-time IoT vitals streaming** to deliver early disease-risk stratification. It was built as an applied contribution toward **UN Sustainable Development Goal 3 — Good Health & Well-being**, targeting preventable mortality through advanced computational medicine.

The whole application runs as a **single self-contained HTML file** — no build step, no framework, no `npm install`. Just open it in a browser.

---

## ✨ Features

| Module | What it does |
|---|---|
| ⚛ **Risk Predictor** | 6-disease quantum-assisted risk matrix (Cardiovascular, Type 2 Diabetes, Stroke, Hypertension, Obesity, Respiratory) with qubit / depth / fidelity / entanglement metrics and Claude-generated clinical interpretation |
| 🤖 **AI Health Assistant** | Claude-powered chat with **live web search**, patient-context injection, emergency triage, drug / lab / nutrition guidance |
| 📊 **R Analytics Dashboard** | Live vitals trends, Pearson correlations, statistical summary, risk distribution, scatter plots — reads `health_data.json` produced by R scripts |
| 🏥 **Nearby Hospitals** | Geolocation → OpenStreetMap Overpass API → hospitals / clinics / pharmacies / ERs with directions + AI-assisted appointment booking modal |
| 📡 **WiFi Monitor** | Connect to ESP32 / Arduino IoT sensors, stream vitals over WiFi, auto-sync to a Gradio ML model, export CSV / JSON |
| ⚡ **Gradio ML Bridge** | POSTs live vitals to a hosted Gradio risk-classifier endpoint and renders AI classification |

---

## 🚀 Quick Start

### Option A — Serve locally

```bash
git clone https://github.com/YOUR-USERNAME/quantummed.git
cd quantummed
python3 -m http.server 8000
# Open http://localhost:8000
```

### Option B — Full stack with the AI proxy

```bash
npm install -g netlify-cli
export ANTHROPIC_API_KEY=sk-ant-...
netlify dev
# Open http://localhost:8888
```

> ⚠️ **Geolocation note**: browsers block GPS on `file://`. Serve via `http://localhost` or HTTPS for full location features.

---

## 🌐 Live Demo

**→ [quantummed.netlify.app](https://quantummed.netlify.app)** *(replace with your URL after deploying)*

The AI features are served through a **serverless proxy** (`netlify/functions/claude.js`) so the API key never touches the browser. To self-host:

1. Fork this repo
2. Connect it to Netlify
3. Set the env var `ANTHROPIC_API_KEY` in Netlify's dashboard
4. Deploy

See [docs/SETUP.md](docs/SETUP.md) for details.

---

## 🏗 Architecture

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
                                          │
                                 ┌────────┴─────────┐
                                 │  ESP32 / Arduino │
                                 │  WiFi sensor     │
                                 └──────────────────┘
```

**Tech stack:**

- **Frontend**: Vanilla JS (ES2022), HTML5, CSS3 custom design system
- **AI**: Anthropic Claude Sonnet 4 (`web_search_20250305` tool)
- **Charts**: Chart.js 4.4
- **Maps**: Leaflet 1.9 + OpenStreetMap + Overpass API
- **ML Bridge**: Gradio REST (`/run/predict`)
- **IoT**: ESP32 / Arduino over WiFi (HTTP POST)
- **Analytics**: R (external scripts → `health_data.json`)
- **Serverless**: Netlify Functions (ESM) / Vercel Functions

---

## 🔧 Configuration

### Gradio ML endpoint

Edit the URL in the WiFi Monitor or R Analytics tab, or change the default in `index.html`:

```html
value="https://YOUR-SPACE.gradio.live"
```

### Health data source

The R Analytics dashboard reads from `/health_data.json` by default. Change the path at runtime in the dashboard's LOAD bar, or edit `index.html`:

```html
<input class="r-path-input" id="r-json-path" value="/health_data.json">
```

### Expected `health_data.json` schema

```json
[
  { "Time": "2025-01-01 12:00:00", "Temperature": 98.6, "BPM": 72, "SpO2": 98, "Risk": "NORMAL" },
  { "Time": "2025-01-01 12:10:00", "Temperature": 101.2, "BPM": 128, "SpO2": 90, "Risk": "CRITICAL" }
]
```

### ESP32 payload (POST to your server)

```json
{
  "device_id": "QM-001",
  "patient_age": 45,
  "heart_rate": 72,
  "spo2": 98,
  "temperature": 36.6,
  "bp_systolic": 120,
  "bp_diastolic": 80,
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

## 🔐 Security

- API key is **never** shipped to the browser
- IP-based rate limiting (20 req/min per IP by default)
- Model allow-list restricts calls to approved Claude models
- Token cap per request (2000 max)

See [SECURITY.md](SECURITY.md) for details.

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome — especially:

- Real R script integration (currently the dashboard uses demo data)
- Web Bluetooth / Web Serial support for BLE sensors
- Additional disease models
- Translations (i18n)

---

## 📜 License

MIT © 2025 Dhruv Oberoi — see [LICENSE](LICENSE).

---

## 🙏 Acknowledgements

- [Anthropic Claude](https://anthropic.com) for the clinical reasoning engine
- [OpenStreetMap](https://openstreetmap.org) & [Overpass API](https://overpass-api.de) for free geospatial data
- [Chart.js](https://chartjs.org), [Leaflet](https://leafletjs.com), [Gradio](https://gradio.app)
- The **UN SDG 3** framework for the design motivation

---

<div align="center">

**⚠ Medical Disclaimer**

QuantumMed is an informational and research tool only. It is **not** a medical device and does **not** provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional. In an emergency, call **112 / 911 / 999**.

</div>