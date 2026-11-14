// Demo data for the Northwind Inc. savings dashboard (last 30 days: Oct 15 – Nov 13, 2026).
const WITHOUT = [2770,2730,2790,2660,2890,2920,2820,2900,2980,3090,2860,3130,3090,3200,3000,3290,3260,3240,3850,3380,3440,3270,3470,3470,3580,3360,3670,3610,3660,4020]
const SAVED = [1060,1110,1000,1070,1090,1120,1250,1180,1150,1230,1206,1320,1370,1280,1340,1330,1360,1510,1800,1440,1480,1430,1570,1630,1560,1620,1580,1600,1750,1850]

export const daily = WITHOUT.map((without, i) => {
  const d = new Date(2026, 9, 15 + i)
  return {
    date: d,
    label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    without,
    with: without - SAVED[i],
    saved: SAVED[i],
    band: [without - SAVED[i], without],
  }
})

export const kpis = {
  saved: 41286,
  savedDelta: 9,
  wouldHavePaid: 96400,
  actuallyPaid: 55114,
  lessPct: 43,
  optimizedPct: 58,
  optimized: '1.12M',
  total: '1.92M',
  firstTry: 98.4,
  retried: 1.6,
  avgPerDay: 1376,
  bestDay: 'Nov 13, $1,850',
  projectedYearly: 502000,
}

export const breakdown = [
  { name: 'Smart Route', share: 64, saved: 26420, color: '#5FD0CB' },
  { name: 'EcoPrompt', share: 25, saved: 10320, color: '#9EE6B9' },
  { name: 'Peak queue', share: 11, saved: 4546, color: '#F5C27A' },
]

export const features = [
  {
    name: 'Sales: weekly summary',
    helpers: ['EcoPrompt', 'Smart Route'],
    before: 0.84,
    after: 0.06,
    runs: 8220,
    saved: 6410,
    model: { before: 'Big model', after: 'Small model' },
    tokens: { before: 2840, after: 410 },
    prompt: {
      before:
        'You are a helpful sales analyst. Summarize this week\'s sales.\nYou are a helpful sales analyst. Please summarize the sales.\nKeep it under 5 bullet points.\n\nData: [full 1,240-row sales export pasted as JSON …]',
      after: 'You are a sales analyst. Summarize this week\'s sales in ≤5 bullets.\n\nData: {top 20 rows + weekly totals by region}',
    },
  },
  {
    name: 'Support: password resets',
    helpers: ['Smart Route'],
    before: 0.021,
    after: 0.001,
    runs: 212000,
    saved: 4240,
    model: { before: 'Big model', after: 'Small model' },
    tokens: { before: 620, after: 610 },
    prompt: {
      before: 'Customer asks: "How do I reset my password?"\nAnswer using the help-center article below.\n\n[help-center article]',
      after: 'Customer asks: "How do I reset my password?"\nAnswer using the help-center article below.\n\n[help-center article]\n\n→ Routed to small model (simple, well-covered question)',
    },
  },
  {
    name: 'Engineering: nightly code review',
    helpers: ['Peak queue'],
    before: 0.42,
    after: 0.31,
    runs: 17800,
    saved: 1960,
    model: { before: 'Big model · 2 PM', after: 'Big model · 2 AM' },
    tokens: { before: 5200, after: 5200 },
    prompt: {
      before: 'Review the diff below for bugs, security issues and style.\n\n[diff]\n\nRuns immediately at 2:00 PM (peak pricing, high water stress).',
      after: 'Review the diff below for bugs, security issues and style.\n\n[diff]\n\nQueued → runs at 2:00 AM (off-peak pricing, lower water use).',
    },
  },
]

export const sampleRequests = [
  { text: "What's 18% of 240?", team: 'Finance', tag: 'No AI', cost: 0.0, base: 0.012 },
  { text: 'Reset password help for user #4821', team: 'Support', tag: 'Small model', cost: 0.001, base: 0.021 },
  { text: 'Draft Q4 pricing strategy memo', team: 'Sales', tag: 'Big model', cost: 0.38, base: 0.38 },
  { text: 'Weekly summary (repeated instructions)', team: 'Sales', tag: 'Trimmed', cost: 0.06, base: 0.84 },
  { text: 'Nightly code review: payments-service', team: 'Engineering', tag: 'Queued', cost: 0.31, base: 0.42 },
  { text: 'Classify ticket: "billing question"', team: 'Support', tag: 'Small model', cost: 0.0008, base: 0.018 },
  { text: 'Convert 250 EUR to USD', team: 'Finance', tag: 'No AI', cost: 0.0, base: 0.01 },
  { text: 'Onboarding email (filler removed)', team: 'People', tag: 'Trimmed', cost: 0.02, base: 0.05 },
]

export const TAG_STYLES = {
  'No AI': { color: '#9EE6B9', bg: 'rgba(158,230,185,0.12)' },
  'Small model': { color: '#5FD0CB', bg: 'rgba(95,208,203,0.12)' },
  'Big model': { color: '#C9D6D4', bg: 'rgba(255,255,255,0.07)' },
  Trimmed: { color: '#9EE6B9', bg: 'rgba(158,230,185,0.12)' },
  Queued: { color: '#F5C27A', bg: 'rgba(245,194,122,0.12)' },
}

export const usd = (n, d = 0) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
export const costFmt = (n) => '$' + n.toFixed(3).replace(/(\.\d\d)0$/, '$1')
