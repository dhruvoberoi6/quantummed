# Changelog

All notable changes to QuantumMed will be documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2025-01-01

### Added

- ⚛ Quantum-assisted 6-disease risk predictor
  (Cardiovascular, Type 2 Diabetes, Stroke, Hypertension, Obesity,
  Respiratory) with quantum circuit metrics (qubits, depth, fidelity,
  entanglement)
- 🤖 AI Health Assistant powered by Claude with live web search
- 📊 R Analytics dashboard — trend charts, Pearson correlations,
  statistical summary, risk distribution, scatter plots
- 🏥 Nearby hospitals discovery via OpenStreetMap Overpass API +
  Leaflet map, with directions
- 📅 AI-assisted appointment booking modal
- 📡 WiFi IoT monitor for ESP32 / Arduino sensor devices
- ⚡ Gradio ML risk-classifier bridge (serverless POST)
- 🌐 Live network status bar (IP, hostname, latency)
- 🔐 Serverless proxy for the Claude API
  (`netlify/functions/claude.js`) — keeps the API key server-side
- 🇺🇳 UN SDG 3 branding throughout
- 📄 Complete documentation set (README, CONTRIBUTING, SECURITY,
  CODE_OF_CONDUCT, SETUP guide)
- 🚀 Auto-deploy configuration for Netlify and Vercel
- 🐙 GitHub Actions workflow for continuous deployment

### Security

- API key is never shipped to the browser
- IP-based rate limiting (20 requests / minute by default)
- Model allow-list restricts calls to approved Claude models
- Token cap per request (2000 max)