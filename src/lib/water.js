// Water Wallet math: tokens ≈ words × 1.3, 0.01 tsp per token, × 1.4 drought multiplier.
export const DROUGHT_MULTIPLIER = 1.4
export const TSP_PER_TOKEN = 0.01
export const DAILY_BUDGET_TSP = 10

export const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0)
export const tokensFor = (text) => Math.round(countWords(text) * 1.3)
export const tspFor = (text) => tokensFor(text) * TSP_PER_TOKEN * DROUGHT_MULTIPLIER

export const fmtTsp = (n) => (n > 0 && n < 0.1 ? n.toFixed(2) : n.toFixed(1))

// Peak Alert: 12 PM – 6 PM is a higher-water time.
export const isPeakHour = (date = new Date()) => {
  const h = date.getHours()
  return h >= 12 && h < 18
}
