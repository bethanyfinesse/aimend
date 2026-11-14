import { Clock } from 'lucide-react'
import Logo from '../Logo.jsx'
import { DAILY_BUDGET_TSP, fmtTsp } from '../../lib/water.js'

const TSP_PER_BOTTLE = 101 // 500 ml bottle

export default function WaterWalletPopup({ wallet }) {
  const pct = Math.min(100, (wallet.usedToday / DAILY_BUDGET_TSP) * 100)
  const bottles = Math.round((wallet.savedWeek / TSP_PER_BOTTLE) * 10) / 10
  const over = wallet.usedToday > DAILY_BUDGET_TSP

  return (
    <div className="frost fade-up absolute right-3 top-14 z-40 w-[300px] p-4" style={{ background: 'rgba(38,40,42,0.92)' }}>
      <div className="flex items-center gap-2 font-semibold text-white">
        <Logo className="w-3.5 h-3.5" /> AiMEND
      </div>
      <div className="text-[12px] text-white/50">Making AI a little less thirsty</div>

      <div className="mt-3 rounded-xl p-3 bg-white/[0.05] border border-white/10">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[26px] num-light text-white">{fmtTsp(wallet.usedToday)}</span>
          <span className="text-[13px] text-white/60">of {DAILY_BUDGET_TSP} tsp today</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: over ? '#F5C27A' : '#3FB0B4' }} />
        </div>
        <div className="text-[12px] text-white/55 mt-2">Water used today, weighted for drought risk</div>
        <div className="text-[11.5px] text-amber/90 mt-1">Estimated data center region: high water stress</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="rounded-xl p-3 bg-white/[0.05] border border-white/10">
          <div className="text-[17px] font-semibold text-teal">{fmtTsp(wallet.savedToday)} tsp</div>
          <div className="text-[11.5px] text-white/50">Saved today</div>
        </div>
        <div className="rounded-xl p-3 bg-white/[0.05] border border-white/10">
          <div className="text-[17px] font-semibold text-teal">{bottles} bottles</div>
          <div className="text-[11.5px] text-white/50">Saved this week</div>
        </div>
      </div>

      <div className="mt-2 rounded-xl p-3 border text-[12.5px]" style={{ background: 'rgba(245,194,122,0.08)', borderColor: 'rgba(245,194,122,0.3)', color: '#F5C27A' }}>
        {wallet.queue.length === 0
          ? 'No prompts queued. Use "Send later?" at peak times.'
          : `${wallet.queue.length} prompt${wallet.queue.length > 1 ? 's' : ''} saved to send at 9 PM, a lower-water time`}
        {wallet.queue.map((q) => (
          <div key={q.id} className="flex items-center gap-1.5 mt-1.5 text-white/70">
            <Clock size={11} className="shrink-0" /> <span className="truncate">{q.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
