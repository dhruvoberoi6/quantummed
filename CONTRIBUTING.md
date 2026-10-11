# Contributing to QuantumMed

First off — thank you! 🎉

## Ground rules

- Be respectful. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- One feature / fix per pull request.
- Test in **Chrome, Firefox, and Safari** before submitting (this is a single-file browser app).
- Never commit real patient data, API keys, or personal health information.

## Dev workflow

```bash
git clone https://github.com/YOUR-USERNAME/quantummed.git
cd quantummed
npm install -g netlify-cli
export ANTHROPIC_API_KEY=sk-ant-...
netlify dev
# Open http://localhost:8888