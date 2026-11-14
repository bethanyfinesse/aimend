# AiMEND · Making AI a little less thirsty

Hackathon demo. React + Vite + Tailwind, no backend.

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
