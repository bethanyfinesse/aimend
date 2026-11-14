export const FILES = {
  'weekly.ts': {
    language: 'typescript',
    value: `import { aimend } from "./aimend"

// Weekly sales summary for the team inbox
export async function weeklySummary(salesData: Sale[]) {
  return aimend.chat({
    model: "auto",
    urgent: false,
    prompt: \`You are a helpful sales analyst. Summarize this week's sales.
You are a helpful sales analyst. Please summarize the sales.
Keep it under 5 bullet points.
Data: \${JSON.stringify(salesData)}\`,
  })
}

// Answer a customer's quick question
export async function quickAnswer(question: string) {
  return aimend.chat({ model: "auto", prompt: question })
}
`,
  },
  'routes.ts': {
    language: 'typescript',
    value: `import { weeklySummary, quickAnswer } from "./weekly"
import { router } from "./server"

router.post("/summary", async (req) => weeklySummary(req.body.sales))
router.post("/ask", async (req) => quickAnswer(req.body.question))
`,
  },
  'support.ts': {
    language: 'typescript',
    value: `import { aimend } from "./aimend"

export async function resetPasswordHelp(email: string) {
  return aimend.chat({ model: "auto", prompt: \`Explain how \${email} can reset their password.\` })
}
`,
  },
  'package.json': {
    language: 'json',
    value: `{
  "name": "sales-app",
  "version": "1.0.0",
  "dependencies": {
    "aimend": "^0.4.0"
  }
}
`,
  },
}
