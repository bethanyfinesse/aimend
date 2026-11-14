import Drop from '../Drop.jsx'
import { fmtTsp, tspFor } from '../../lib/water.js'

export default function EcoCard({ issue, style, onTrim, onIgnore }) {
  const saved = tspFor(issue.text)
  return (
    <div className="frost fade-up absolute z-30 w-[300px] p-4" style={style}>
      <div className="flex items-center gap-2 text-[13px] font-semibold text-teal">
        <Drop className="w-3 h-3" /> {issue.title}
      </div>
      <p className="text-[13.5px] text-white/80 mt-1.5 leading-snug">
        {issue.kind === 'repeat'
          ? `Trimming it saves about ${fmtTsp(saved)} tsp and won't change the answer.`
          : `Filler words don't change the answer. Trimming saves about ${fmtTsp(saved)} tsp.`}
      </p>
      <div className="flex gap-2 mt-3">
        <button onClick={onTrim} className="px-3.5 py-1.5 rounded-full text-[13px] pill-teal font-medium hover:brightness-125">Trim</button>
        <button onClick={onIgnore} className="px-3.5 py-1.5 rounded-full text-[13px] btn-ghost">Ignore</button>
      </div>
    </div>
  )
}
