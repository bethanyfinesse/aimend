// EcoPrompt: find filler phrases and sentences that repeat an earlier one.
const FILLERS = [
  'if you can please',
  'and stuff',
  'just like',
  'basically',
  'you know',
  'kind of',
  'sort of',
]

const STOP = new Set('i a an the and or to of in on for my me is are be can you it this that with up so do please note'.split(' '))
const contentWords = (s) =>
  new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w)))

function sentenceSpans(text) {
  const spans = []
  const re = /[^.!?]+[.!?]*/g
  let m
  while ((m = re.exec(text))) {
    const lead = m[0].length - m[0].trimStart().length
    const body = m[0].trim()
    if (body) spans.push({ start: m.index + lead, end: m.index + lead + body.length, text: body })
  }
  return spans
}

export function findIssues(text) {
  const issues = []
  const sentences = sentenceSpans(text)

  sentences.forEach((s, i) => {
    const words = contentWords(s.text)
    if (words.size < 3) return
    for (let j = 0; j < i; j++) {
      const prev = contentWords(sentences[j].text)
      const overlap = [...words].filter((w) => prev.has(w)).length
      if (overlap / Math.min(words.size, prev.size) >= 0.6) {
        issues.push({ ...s, kind: 'repeat', title: j === 0 ? 'This part repeats your first sentence' : 'This part repeats an earlier sentence' })
        return
      }
    }
  })

  const lower = text.toLowerCase()
  for (const f of FILLERS) {
    let idx = 0
    while ((idx = lower.indexOf(f, idx)) !== -1) {
      const before = idx === 0 || /\W/.test(lower[idx - 1])
      const after = idx + f.length >= lower.length || /\W/.test(lower[idx + f.length])
      const end = idx + f.length
      const inside = issues.some((x) => idx < x.end && end > x.start)
      if (before && after && !inside) {
        issues.push({ start: idx, end, text: text.slice(idx, end), kind: 'filler', title: `"${text.slice(idx, end)}" is filler` })
      }
      idx = end
    }
  }
  return issues.sort((a, b) => a.start - b.start)
}

export function trimIssue(text, issue) {
  return (text.slice(0, issue.start) + text.slice(issue.end))
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .replace(/\.\s*\./g, '.')
    .trim()
}

/** True when `line` mostly repeats `prev` (used for prompts written across code lines). */
export function repeatsLine(line, prev) {
  const a = contentWords(line)
  const b = contentWords(prev)
  if (a.size < 3 || b.size < 3) return false
  const overlap = [...a].filter((w) => b.has(w)).length
  return overlap / Math.min(a.size, b.size) >= 0.6
}
