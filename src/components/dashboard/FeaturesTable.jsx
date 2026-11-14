import { ArrowRight } from 'lucide-react'
import { costFmt, features, usd } from '../../lib/dashboardData.js'

export const HelperTag = ({ children }) => (
  <span className="inline-block px-2 py-0.5 mr-1.5 rounded-md text-[12.5px] font-medium pill-teal">{children}</span>
)

export default function FeaturesTable({ onCompare }) {
  return (
    <section className="glass p-6 lg:p-7 relative overflow-hidden">
      <div className="absolute -bottom-24 left-1/2 w-[600px] h-[220px] rounded-full blur-[90px] pointer-events-none" style={{ background: 'rgba(138,90,34,0.35)' }} />
      <div className="relative flex items-center justify-between">
        <h2 className="text-[17px] font-semibold">Top optimized AI features</h2>
        <button className="text-teal text-[14px] font-medium hover:underline">See all 48</button>
      </div>
      <div className="relative overflow-x-auto mt-3">
        <table className="w-full text-[14.5px] min-w-[760px]">
          <thead>
            <tr className="text-muted text-[13px]">
              <th className="text-left font-normal py-2">App feature</th>
              <th className="text-left font-normal">How AiMEND helped</th>
              <th className="text-left font-normal">Cost per run</th>
              <th className="text-right font-normal">Runs</th>
              <th className="text-right font-normal">Saved (30 days)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.name} className="border-t border-white/[0.07]">
                <td className="py-3.5 font-medium">{f.name}</td>
                <td>{f.helpers.map((h) => <HelperTag key={h}>{h}</HelperTag>)}</td>
                <td className="whitespace-nowrap">
                  <span className="text-ink/75">{costFmt(f.before)}</span>
                  <ArrowRight size={12} className="inline mx-1.5 text-muted" />
                  <span className="font-semibold">{costFmt(f.after)}</span>
                </td>
                <td className="text-right">{f.runs.toLocaleString()}</td>
                <td className="text-right font-semibold text-mint">{usd(f.saved)}</td>
                <td className="text-right pl-6">
                  <button onClick={() => onCompare(f)} className="text-teal font-medium whitespace-nowrap hover:underline">
                    Before / after
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
