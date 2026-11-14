import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { breakdown, usd } from '../../lib/dashboardData.js'
import Dropdown from './Dropdown.jsx'

export default function SavingsBreakdown() {
  const [range, setRange] = useState('Last 30 days')
  const [hover, setHover] = useState(null)
  const total = breakdown.reduce((a, b) => a + b.saved, 0)
  const active = hover != null ? breakdown[hover] : null

  return (
    <section className="glass p-6 lg:p-7 flex flex-col">
      <div className="flex items-start justify-between">
        <h2 className="text-[17px] font-semibold">What saved the money</h2>
        <Dropdown value={range} options={['Last 7 days', 'Last 30 days', 'Last 90 days']} onChange={setRange} />
      </div>

      <div className="glass-inner mt-4 h-[260px] relative" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(95,208,203,0.10), rgba(255,255,255,0.02) 65%)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breakdown}
              dataKey="saved"
              innerRadius="62%"
              outerRadius="82%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              stroke="none"
              onMouseLeave={() => setHover(null)}
              onMouseEnter={(_, i) => setHover(i)}
            >
              {breakdown.map((b, i) => (
                <Cell key={b.name} fill={b.color} opacity={hover == null || hover === i ? 1 : 0.35} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-[30px] num-light">{active ? usd(active.saved) : `$${(total / 1000).toFixed(1)}k`}</div>
            <div className="text-[13px] text-muted">{active ? active.name : 'saved'}</div>
          </div>
        </div>
      </div>

      <table className="w-full mt-5 text-[14.5px]">
        <thead>
          <tr className="text-muted text-[13px]">
            <th className="text-left font-normal pb-2">Feature</th>
            <th className="text-right font-normal pb-2">Share</th>
            <th className="text-right font-normal pb-2">Saved</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((b, i) => (
            <tr key={b.name} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="border-t border-white/[0.07]">
              <td className="py-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full mr-3" style={{ background: b.color }} />
                {b.name}
              </td>
              <td className="text-right">{b.share}%</td>
              <td className="text-right">{usd(b.saved)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
