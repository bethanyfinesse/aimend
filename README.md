# AiMEND · Making AI a little less thirsty

Hackathon demo. React + Vite + Tailwind, no backend.

**Live demo:** https://bethanyfinesse.github.io/aimend/

## What it is

AI models use a lot of water and electricity, and much of that is wasted on oversized models and wordy prompts. AiMEND shows how to cut it, in three places people already work:

- **Water Wallet:** estimates the water each prompt costs.
- **EcoPrompt:** suggests shorter prompts that get the same answer.
- **Smart Route:** sends simple questions to a smaller, cheaper model.
- **Peak Alert:** flags high-demand hours so work can shift to off-peak.

All numbers are demo data and estimates, not measurements.

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

Routes (switch with the floating nav at the bottom):

- `/dashboard`: gateway savings for companies (demo data)
- `/extension`: chat assistant with Water Wallet, Peak Alert, EcoPrompt, Smart Route
- `/developer`: VS Code-style Monaco editor with EcoPrompt markers + quick fixes, Smart Route / Peak Alert CodeLenses

Smart Route runs `Xenova/all-MiniLM-L6-v2` in the browser via `@huggingface/transformers`
(about 23 MB on first load, then cached). The badge at the bottom right shows "AiMEND model ready", or "Fallback mode" (keyword rules) if the model can't load.
Monaco and the model both download from CDNs, so the first load needs internet.

Demo tips: click the Peak Alert dot in the chat status pill to toggle peak/off-peak. Click an underlined phrase in the chat input to open EcoPrompt.

## Deploy

Pushing to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`. In the repo settings, Pages → Source must be set to GitHub Actions.
