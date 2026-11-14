import { useSyncExternalStore } from 'react'

// Example prompts the classifier compares against.
const SIMPLE = [
  "What's 15% of 76.80?",
  'What is 12 times 8?',
  'Convert 5 miles to kilometers',
  'What time is it in Tokyo?',
  'What is the capital of France?',
  'How many days are in February?',
  'Spell necessary',
  "What's 2 + 2?",
  'How many ounces in a pound?',
  'What day of the week is Christmas?',
  'Define photosynthesis in one line',
  'What is the square root of 144?',
  'Calculate a 20% tip on $45',
  'Who wrote Romeo and Juliet?',
  'How many feet in a mile?',
]

const COMPLEX = [
  'Can you help me make a study plan for my finals?',
  'Write a cover letter for a software engineering internship',
  'Explain how photosynthesis works in detail with examples',
  'Plan a weekend trip itinerary for three friends on a budget',
  'Summarize this week of sales data and highlight trends',
  'Debug my React component that re-renders forever',
  'Compare the pros and cons of renting vs buying a home',
  'Write a short story about a robot learning to paint',
  'Help me prepare for a behavioral job interview',
  'Design a database schema for a library app',
  'Draft an email to my professor asking for an extension',
  'Explain the causes of World War I and their consequences',
  'Create a weekly workout routine for a beginner',
  'Analyze the themes in The Great Gatsby',
  'Refactor this function to be more readable and add tests',
  'Write a poem about my dog',
  'Brainstorm gift ideas for my mom',
]

let state = { status: 'loading', progress: 0 }
const listeners = new Set()
const set = (patch) => {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

let extractor = null
let simpleVecs = []
let complexVecs = []
let started = false

const dot = (a, b) => {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s // vectors are normalized, so dot product == cosine similarity
}

async function embed(texts) {
  const out = await extractor(texts, { pooling: 'mean', normalize: true })
  return out.tolist()
}

export async function initSmartRoute() {
  if (started) return
  started = true
  try {
    const { pipeline } = await import('@huggingface/transformers')
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'q8',
      progress_callback: (p) => {
        if (p.status === 'progress' && p.file?.endsWith('.onnx')) set({ progress: Math.round(p.progress) })
      },
    })
    simpleVecs = await embed(SIMPLE)
    complexVecs = await embed(COMPLEX)
    set({ status: 'ready', progress: 100 })
  } catch (err) {
    console.warn('[AiMEND] model failed to load, using keyword rules', err)
    set({ status: 'fallback' })
  }
}

// Only skip AI when the prompt is clearly closer to the simple examples.
const MARGIN = 0.05

// Average of the top-3 similarities to each class.
const topScore = (v, vecs) =>
  vecs.map((x) => dot(v, x)).sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b, 0) / 3

function keywordRules(text) {
  const t = text.toLowerCase().trim()
  const words = t.split(/\s+/).length
  if (/^[\d\s.+\-*/%()^$,]+$/.test(t)) return true
  if (/\b(\d+(\.\d+)?\s*%|tip|convert|square root|times|plus|minus|capital of|how many|what time|spell)\b/.test(t) && words <= 12) return true
  return false
}

/** Returns { simple: boolean, simpleScore, complexScore, method } */
export async function classify(text) {
  if (!text.trim()) return { simple: false, method: 'none' }
  if (state.status !== 'ready') return { simple: keywordRules(text), method: 'rules' }
  const [v] = await embed([text])
  const simpleScore = topScore(v, simpleVecs)
  const complexScore = topScore(v, complexVecs)
  return { simple: simpleScore - complexScore > MARGIN, simpleScore, complexScore, method: 'model' }
}

export function useModelStatus() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state,
  )
}
