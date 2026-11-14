# AiMEND · Making AI a little less thirsty

Built at the **NSBE AI Impact-a-thon** (Fall Regional Conference 2026).

**Live demo:** https://bethanyfinesse.github.io/aimend/

## The idea
The challenge asked us to use AI to tackle an environmental problem, and AI itself is one: data centers use huge amounts of water to cool their servers, and nobody can see the cost of their prompts. AiMEND (AI + mend) is AI making amends: a small, efficient AI that reduces the work of big, water-hungry models. It suggests, explains, and lets you decide. It never blocks you.

## Two products, one engine
- **AiMEND Extension** (everyday users): works inside AI chatbots
- **AiMEND Gateway** (companies and developers): sits between apps and AI providers, with a VS Code plugin and a savings dashboard

## Features
- **Water Wallet:** shows each prompt's estimated water cost, weighted by drought risk, with a daily budget
- **Peak Alert:** flags higher-water hours and lets non-urgent work wait
- **EcoPrompt:** underlines wasteful prompt text, like spellcheck
- **Smart Route:** sends each request to the smallest option that can handle it: no AI, a small model, or a big model

## How the AI works
Smart Route runs `Xenova/all-MiniLM-L6-v2` (about 22M parameters, ~23 MB) in the browser via Transformers.js. It embeds each prompt and compares it to example simple and complex questions using cosine similarity. Simple questions get answered without a large model. If the model can't load, it falls back to keyword rules.

## Real vs. simulated
- **Real:** the Smart Route AI model, prompt-trimming rules, cost and water math, calculator answers
- **Simulated:** chatbot replies, dashboard data, data center regions and drought scores, peak hours

All water and cost numbers are estimates based on published research, not measurements.

## Tech stack
React, Vite, Tailwind CSS, React Router, Recharts, Monaco Editor, math.js, Transformers.js. No backend. Built with help from Claude Code.

## Run locally
Requires Node 20+.

    npm install
    npm run dev

Routes: `/dashboard` (gateway savings), `/extension` (chat demo), `/developer` (VS Code plugin demo).

## Team
Bethany, Khulthum, Nnamdi, Prince, Will
