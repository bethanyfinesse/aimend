import { repeatsLine } from './ecoPrompt.js'

const OWNER = 'aimend'
const CALLS = {
  weeklySummary: { costs: { small: '$0.002', big: '$0.03' } },
  quickAnswer: { costs: { small: '$0.0004', big: '$0.01' } },
}

/** Find EcoPrompt issues in a model and return Monaco markers (+ the fix for each). */
function findEcoIssues(monaco, model) {
  const issues = []
  const lines = model.getLinesContent()
  lines.forEach((line, i) => {
    const n = i + 1
    if (i > 0 && repeatsLine(line, lines[i - 1])) {
      const start = line.length - line.trimStart().length + 1
      issues.push({
        marker: {
          severity: monaco.MarkerSeverity.Info,
          source: 'AiMEND',
          code: 'EcoPrompt',
          message: `EcoPrompt: repeated instruction\nLine ${n} repeats the instruction on line ${n - 1}.\nSaves ≈ 40 tokens, about $0.12 per 1,000 calls.`,
          startLineNumber: n, startColumn: start, endLineNumber: n, endColumn: line.length + 1,
        },
        fix: { title: 'AiMEND: Apply fix (remove repeated line)', range: new monaco.Range(n, 1, n + 1, 1), text: '' },
      })
    }
    const m = line.match(/JSON\.stringify\((\w+)\)/)
    if (m && !/slice|summarize/.test(line)) {
      const col = line.indexOf(m[0]) + 1
      issues.push({
        marker: {
          severity: monaco.MarkerSeverity.Info,
          source: 'AiMEND',
          code: 'EcoPrompt',
          message: `EcoPrompt: full dataset pasted into prompt\nEvery row of ${m[1]} is sent on each call (~2,300 tokens).\nSend the top 20 rows instead. Saves ≈ 1,900 tokens, about $5.70 per 1,000 calls.`,
          startLineNumber: n, startColumn: col, endLineNumber: n, endColumn: col + m[0].length,
        },
        fix: { title: 'AiMEND: Apply fix (send top 20 rows)', range: new monaco.Range(n, col, n, col + m[0].length), text: `JSON.stringify(${m[1]}.slice(0, 20))` },
      })
    }
  })
  return issues
}

/**
 * Wire AiMEND into a Monaco editor: EcoPrompt markers + quick fixes,
 * Smart Route and Peak Alert CodeLenses. Returns { dispose }.
 */
export function registerAimend(monaco, editor, { onSuggestions }) {
  const disposables = []
  const lensState = {
    weeklySummary: { model: 'big', locked: false, queued: true },
    quickAnswer: { model: 'small', locked: false, queued: false },
  }
  let issues = []
  const lensChanged = new monaco.Emitter()
  const isWeekly = (model) => model.uri.path.endsWith('weekly.ts')

  const refresh = () => {
    const model = editor.getModel()
    if (!model) return
    issues = isWeekly(model) ? findEcoIssues(monaco, model) : []
    monaco.editor.setModelMarkers(model, OWNER, issues.map((i) => i.marker))
    onSuggestions(issues.length + (lensState.weeklySummary.queued ? 1 : 0))
  }

  disposables.push(
    monaco.editor.registerCommand('aimend.noop', () => {}),
    monaco.editor.registerCommand('aimend.change', (_, fn) => {
      const s = lensState[fn]
      s.model = s.model === 'small' ? 'big' : 'small'
      s.locked = false
      lensChanged.fire()
    }),
    monaco.editor.registerCommand('aimend.lock', (_, fn) => {
      const s = lensState[fn]
      s.locked = !s.locked
      if (s.locked) s.model = 'big'
      lensChanged.fire()
    }),
    monaco.editor.registerCommand('aimend.peak', (_, fn) => {
      lensState[fn].queued = !lensState[fn].queued
      lensChanged.fire()
      refresh()
    }),

    monaco.languages.registerCodeActionProvider('typescript', {
      provideCodeActions(model, range, context) {
        const actions = issues
          .filter((i) => context.markers.some((m) => m.owner === OWNER && m.startLineNumber === i.marker.startLineNumber && m.startColumn === i.marker.startColumn))
          .map((i) => ({
            title: i.fix.title,
            kind: 'quickfix',
            isPreferred: true,
            diagnostics: [i.marker],
            edit: { edits: [{ resource: model.uri, textEdit: { range: i.fix.range, text: i.fix.text }, versionId: model.getVersionId() }] },
          }))
        return { actions, dispose() {} }
      },
    }),

    monaco.languages.registerCodeLensProvider('typescript', {
      onDidChange: lensChanged.event,
      provideCodeLenses(model) {
        if (!isWeekly(model)) return { lenses: [], dispose() {} }
        const lenses = []
        model.getLinesContent().forEach((line, i) => {
          const fn = line.match(/function (\w+)\(/)?.[1]
          if (!fn || !CALLS[fn]) return
          const s = lensState[fn]
          const range = new monaco.Range(i + 1, 1, i + 1, 1)
          const add = (title, id) => lenses.push({ range, command: { id, title, arguments: [fn] } })
          add(`$(circle-filled) Smart Route: ${s.model} model · ~${CALLS[fn].costs[s.model]}/call${s.locked ? ' · locked' : ''}`, 'aimend.noop')
          add('Change', 'aimend.change')
          add(s.locked ? 'Unlock' : 'Lock to big model', 'aimend.lock')
          if (/urgent:\s*false/.test(model.getValue()) && fn === 'weeklySummary') {
            if (s.queued) {
              add('$(clock) Peak Alert: can wait, runs at 2 AM (lower cost and water)', 'aimend.noop')
              add('Run now', 'aimend.peak')
            } else {
              add('$(zap) Peak Alert: runs now (peak hours, higher cost and water)', 'aimend.noop')
              add('Queue for 2 AM', 'aimend.peak')
            }
          }
        })
        return { lenses, dispose() {} }
      },
    }),

    editor.onDidChangeModelContent(refresh),
    editor.onDidChangeModel(refresh),
  )
  refresh()
  return { dispose: () => disposables.forEach((d) => d.dispose()) }
}
