import { evaluate, format } from 'mathjs'

const FACTS = [
  [/capital of france/i, 'Paris'],
  [/capital of japan/i, 'Tokyo'],
  [/capital of (the )?(us|usa|united states)/i, 'Washington, D.C.'],
  [/days (are )?in february/i, '28 (29 in a leap year)'],
  [/wrote romeo and juliet/i, 'William Shakespeare'],
  [/feet in a mile/i, '5,280 feet'],
  [/ounces in a pound/i, '16 ounces'],
  [/spell necessary/i, 'n-e-c-e-s-s-a-r-y'],
]

const toExpr = (q) =>
  q
    .toLowerCase()
    .replace(/^(what('|’)?s|what is|calculate|compute|how much is|convert)\s+/, '')
    .replace(/\?|\$|,/g, '')
    .replace(/(\d+(?:\.\d+)?)\s*%\s*(?:tip\s+)?(?:of|on)\s+/g, '$1% * ')
    .replace(/\b(\d+(?:\.\d+)?)\s*% tip on\s+/g, '$1% * ')
    .replace(/\bsquare root of\s+(\S+)/g, 'sqrt($1)')
    .replace(/\btimes\b|\bx\b/g, '*')
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\bdivided by\b/g, '/')
    .replace(/\ba (\d+(?:\.\d+)?)% tip on\s+/g, '$1% * ')
    .trim()

/** Answer simple questions locally with no AI. Returns a string or null. */
export function quickAnswer(question) {
  for (const [re, ans] of FACTS) if (re.test(question)) return ans
  if (/what time is it/i.test(question)) return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  try {
    const r = evaluate(toExpr(question))
    if (typeof r === 'number' && question.includes('$')) return '$' + r.toFixed(2)
    if (typeof r === 'number') return format(r, { precision: 10 }).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
    if (r && typeof r.toString === 'function' && !(typeof r === 'function')) return format(r, { precision: 4 })
  } catch {
    /* not math */
  }
  return null
}
