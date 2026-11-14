import { ArrowUp } from 'lucide-react'
import { kpis, usd } from '../../lib/dashboardData.js'
import { useCountUp } from '../../lib/useCountUp.js'
import InfoDot from './InfoDot.jsx'

function Kpi({ label, tip, children, foot }) {
  return (
    <div className="px-6 py-5 md:border-l border-white/[0.08] first:border-l-0">
      <div className="flex items-center gap-1.5 text-[13.5px] text-muted">
        {label} <InfoDot tip={tip} />
      </div>
      <div className="mt-2">{children}</div>
      <div className="mt-2.5 flex items-center gap-2 text-[12.5px] text-muted">{foot}</div>
    </div>
  )
}

const Chip = ({ children, tone = 'green' }) => (
  <span
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-semibold"
    style={tone === 'green' ? { background: 'rgba(158,230,185,0.14)', color: '#9EE6B9' } : { background: 'rgba(255,255,255,0.08)', color: '#C9D6D4' }}
  >
    {children}
  </span>
)

export default function KpiStrip({ runKey }) {
  const o = { runKey, from: 0 }
  const saved = useCountUp(kpis.saved, o)
  const would = useCountUp(kpis.wouldHavePaid, o)
  const paid = useCountUp(kpis.actuallyPaid, o)
  const opt = useCountUp(kpis.optimizedPct, o)
  const first = useCountUp(kpis.firstTry, o)

  return (
    <section className="glass grid grid-cols-2 lg:grid-cols-5 overflow-hidden" style={{ background: 'linear-gradient(110deg, rgba(95,208,203,0.10), rgba(255,255,255,0.04) 40%)' }}>
      <Kpi label="Saved" tip="Would have paid minus actually paid" foot={<><Chip><ArrowUp size={12} /> {kpis.savedDelta}%</Chip> vs previous 30 days</>}>
        <div className="num-light text-[40px] leading-none text-teal">{usd(Math.round(saved))}</div>
      </Kpi>
      <Kpi label="Would have paid" tip="Cost if every request went straight to the big model" foot="without AiMEND">
        <div className="num-light text-[40px] leading-none text-ink/70">{usd(Math.round(would))}</div>
      </Kpi>
      <Kpi label="Actually paid" tip="What you were billed through the gateway" foot={<><Chip>{kpis.lessPct}% less</Chip> than without</>}>
        <div className="num-light text-[40px] leading-none">{usd(Math.round(paid))}</div>
      </Kpi>
      <Kpi label="Requests optimized" tip="Requests answered without AI, routed to a smaller model, trimmed or queued" foot={`${kpis.optimized} of ${kpis.total} requests`}>
        <div className="num-light text-[40px] leading-none">{Math.round(opt)}%</div>
      </Kpi>
      <Kpi label="Answered first try" tip="Requests that did not need a retry on a bigger model" foot={<><Chip tone="gray">{kpis.retried}% retried</Chip> cost included</>}>
        <div className="num-light text-[40px] leading-none">{first.toFixed(1)}%</div>
      </Kpi>
    </section>
  )
}
