import { X } from 'lucide-react'
import { costFmt, usd } from '../../lib/dashboardData.js'
import { HelperTag } from './FeaturesTable.jsx'

function Side({ title, tone, prompt, model, tokens, cost }) {
  return (
    <div className="glass-inner p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[13px] font-semibold uppercase tracking-wide ${tone}`}>{title}</span>
        <span className="text-[12.5px] text-muted">{model}</span>
      </div>
      <pre className="flex-1 whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-ink/90 bg-black/25 rounded-xl p-3.5">{prompt}</pre>
      <div className="flex justify-between mt-3 text-[13px] text-muted">
        <span>{tokens.toLocaleString()} tokens</span>
        <span className="text-ink font-semibold">{costFmt(cost)} / run</span>
      </div>
    </div>
  )
}

export default function BeforeAfter({ feature, onClose }) {
  if (!feature) return null
  const f = feature
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside onClick={(e) => e.stopPropagation()} className="glass slide-in w-full max-w-[860px] h-full rounded-none rounded-l-3xl p-7 overflow-y-auto" style={{ background: 'rgba(10,20,22,0.88)' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-muted text-[13px]">Before / after</div>
            <h3 className="text-[22px] font-semibold mt-1">{f.name}</h3>
            <div className="mt-2">{f.helpers.map((h) => <HelperTag key={h}>{h}</HelperTag>)}</div>
          </div>
          <button onClick={onClose} className="btn-ghost w-9 h-9 grid place-items-center rounded-xl"><X size={16} /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Side title="Before" tone="text-ink/60" prompt={f.prompt.before} model={f.model.before} tokens={f.tokens.before} cost={f.before} />
          <Side title="After AiMEND" tone="text-teal" prompt={f.prompt.after} model={f.model.after} tokens={f.tokens.after} cost={f.after} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            ['Cost per run', `−${Math.round((1 - f.after / f.before) * 100)}%`],
            ['Runs (30 days)', f.runs.toLocaleString()],
            ['Saved (30 days)', usd(f.saved)],
          ].map(([k, v]) => (
            <div key={k} className="glass-inner px-4 py-3">
              <div className="text-[12.5px] text-muted">{k}</div>
              <div className="text-[20px] font-semibold text-mint mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
