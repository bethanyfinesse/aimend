import Drop from '../Drop.jsx'
import { fmtTsp } from '../../lib/water.js'

export default function StatusPill({ tsp, peak, onTogglePeak, onSendLater, canSend }) {
  return (
    <div className="frost !rounded-full inline-flex items-center gap-3 px-4 py-1.5 text-[13px] text-white/75">
      <span className="flex items-center gap-1.5" title="Water Wallet: estimated water for this prompt (drought-weighted)">
        <Drop className="w-3.5 h-3.5" /> ≈ {fmtTsp(tsp)} tsp
      </span>
      <span className="w-px h-4 bg-white/15" />
      <button onClick={onTogglePeak} title="Peak Alert (click to toggle for demo)" className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: peak ? '#F5C27A' : '#9EE6B9' }} />
        {peak ? 'Higher-water time' : 'Lower-water time'}
      </button>
      {peak && (
        <button onClick={onSendLater} disabled={!canSend} className="text-white font-medium underline underline-offset-4 decoration-white/40 hover:decoration-white disabled:opacity-40 disabled:no-underline">
          Send later?
        </button>
      )}
    </div>
  )
}
