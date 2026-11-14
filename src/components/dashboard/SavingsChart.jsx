import { useMemo, useState } from 'react'
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { daily, kpis, usd } from '../../lib/dashboardData.js'
import Dropdown from './Dropdown.jsx'

const fmtK = (v) => `$${(v / 1000).toFixed(1).replace('.0', '')}k`

function weekly(data) {
  const out = []
  for (let i = data.length % 7; i < data.length; i += 7) {
    const chunk = data.slice(i, i + 7)
    const without = chunk.reduce((a, d) => a + d.without, 0)
    const withA = chunk.reduce((a, d) => a + d.with, 0)
    out.push({ ...chunk[0], full: `Week of ${chunk[0].label}`, without, with: withA, saved: without - withA, band: [withA, without] })
  }
  return out
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-xl px-4 py-3 text-[13px] min-w-[240px]" style={{ background: 'rgba(12,22,24,0.92)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
      <div className="flex justify-between gap-6 font-semibold mb-1.5">
        <span>{d.full}</span>
        <span className="text-mint">{usd(d.saved)} saved</span>
      </div>
      <div className="flex justify-between text-ink/80"><span>Without AiMEND</span><span className="font-medium text-ink">{usd(d.without)}</span></div>
      <div className="flex justify-between text-ink/80"><span>With AiMEND</span><span className="font-medium text-ink">{usd(d.with)}</span></div>
    </div>
  )
}

const Cursor = ({ points, height, top }) =>
  points?.[0] ? <rect x={points[0].x - 22} y={top} width={44} height={height} fill="rgba(255,255,255,0.04)" rx={4} /> : null

function Stat({ label, value, accent }) {
  return (
    <div className="glass-inner px-5 py-3.5">
      <div className="text-[13px] text-muted">{label}</div>
      <div className={`mt-1 text-[22px] font-semibold ${accent ? 'text-mint' : 'text-ink'}`}>{value}</div>
    </div>
  )
}

export default function SavingsChart() {
  const [mode, setMode] = useState('Daily')
  const data = useMemo(() => (mode === 'Daily' ? daily : weekly(daily)), [mode])
  const ticks = mode === 'Daily' ? ['Oct 15', 'Oct 22', 'Oct 29', 'Nov 5', 'Nov 13'] : undefined

  return (
    <section className="glass p-6 lg:p-7 flex flex-col">
      <div className="flex items-start justify-between">
        <h2 className="text-[17px] font-semibold">AI cost: without vs. with AiMEND</h2>
        <Dropdown value={mode} options={['Daily', 'Weekly']} onChange={setMode} />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3 mt-3">
        <div className="flex items-baseline gap-3">
          <span className="text-[36px] num-light">{usd(kpis.saved)} saved</span>
          <span className="text-muted text-[14px]">in 30 days</span>
        </div>
        <div className="flex items-center gap-5 text-[13px] text-muted pb-2">
          <span className="flex items-center gap-2"><svg width="18" height="2"><line x1="0" y1="1" x2="18" y2="1" stroke="#8FA5A2" strokeWidth="2" strokeDasharray="4 3" /></svg>Without AiMEND</span>
          <span className="flex items-center gap-2"><span className="w-[18px] h-[2px] bg-teal rounded" />With AiMEND</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(95,208,203,0.35)' }} />Saved</span>
        </div>
      </div>

      <div className="h-[290px] -ml-2 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="savedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3FB0B4" stopOpacity={0.42} />
                <stop offset="100%" stopColor="#8A5A22" stopOpacity={0.32} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 4" />
            <XAxis dataKey="label" ticks={ticks} tick={{ fill: '#8FA5A2', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} interval={mode === 'Daily' ? 'preserveStartEnd' : 0} />
            <YAxis
              tickFormatter={fmtK}
              tick={{ fill: '#8FA5A2', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={44}
              domain={mode === 'Daily' ? [1000, 4500] : ['auto', 'auto']}
              ticks={mode === 'Daily' ? [1500, 2500, 3500, 4500] : undefined}
            />
            <Tooltip content={<ChartTooltip />} cursor={<Cursor />} offset={24} />
            <Area type="linear" dataKey="band" stroke="none" fill="url(#savedFill)" activeDot={false} isAnimationActive />
            <Line type="linear" dataKey="without" stroke="#A9BAB7" strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 5, fill: '#0b1517', stroke: '#E6F0EE', strokeWidth: 2 }} />
            <Line type="linear" dataKey="with" stroke="#5FD0CB" strokeWidth={2.25} dot={false} activeDot={{ r: 5, fill: '#0b1517', stroke: '#5FD0CB', strokeWidth: 2 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <Stat label="Average saved per day" value={usd(kpis.avgPerDay)} />
        <Stat label="Best day" value={kpis.bestDay} />
        <Stat label="Projected yearly savings" value={`≈ ${usd(kpis.projectedYearly)}`} accent />
      </div>
    </section>
  )
}
