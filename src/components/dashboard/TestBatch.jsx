import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { sampleRequests, TAG_STYLES, costFmt } from '../../lib/dashboardData.js'
import { useCountUp } from '../../lib/useCountUp.js'

const Tag = ({ tag }) => (
  <span className="px-2 py-0.5 rounded-md text-[12px] font-semibold whitespace-nowrap" style={{ color: TAG_STYLES[tag].color, background: TAG_STYLES[tag].bg }}>
    {tag}
  </span>
)

function Total({ label, value, accent }) {
  const v = useCountUp(value, { duration: 450 })
  return (
    <div>
      <div className="text-[12px] text-muted">{label}</div>
      <div className={`text-[20px] num-light ${accent ? 'text-mint' : ''}`}>${v.toFixed(3)}</div>
    </div>
  )
}

export default function TestBatch({ open, onClose, onDone }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!open) return
    setShown(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(i)
      if (i >= sampleRequests.length) {
        clearInterval(id)
        onDone()
      }
    }, 520)
    return () => clearInterval(id)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null
  const done = sampleRequests.slice(0, shown)
  const base = done.reduce((a, r) => a + r.base, 0)
  const paid = done.reduce((a, r) => a + r.cost, 0)

  return (
    <div className="glass fade-up fixed z-40 top-24 right-6 w-[440px] max-w-[calc(100vw-48px)] p-5" style={{ background: 'rgba(10,20,22,0.9)' }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Test batch</div>
          <div className="text-[12.5px] text-muted">{shown < sampleRequests.length ? 'Sending sample requests through the gateway…' : `${sampleRequests.length} requests processed`}</div>
        </div>
        <button onClick={onClose} className="btn-ghost w-8 h-8 grid place-items-center rounded-lg"><X size={14} /></button>
      </div>
      <div className="mt-4 space-y-1.5 min-h-[300px]">
        {done.map((r) => (
          <div key={r.text} className="slide-in flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.035] border border-white/[0.06]">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] truncate">{r.text}</div>
              <div className="text-[11.5px] text-muted">{r.team} · {costFmt(r.base)} → {costFmt(r.cost)}</div>
            </div>
            <Tag tag={r.tag} />
          </div>
        ))}
        {shown < sampleRequests.length && (
          <div className="flex items-center gap-2 px-3 py-2 text-[12.5px] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" /> routing request {shown + 1}…
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.08]">
        <Total label="Would have paid" value={base} />
        <Total label="Actually paid" value={paid} />
        <Total label="Saved" value={base - paid} accent />
      </div>
    </div>
  )
}
