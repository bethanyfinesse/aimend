import { useEffect, useState } from 'react'
import { CalendarDays, ChevronDown, Download, Play } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'
import KpiStrip from '../components/dashboard/KpiStrip.jsx'
import SavingsChart from '../components/dashboard/SavingsChart.jsx'
import SavingsBreakdown from '../components/dashboard/SavingsBreakdown.jsx'
import FeaturesTable from '../components/dashboard/FeaturesTable.jsx'
import BeforeAfter from '../components/dashboard/BeforeAfter.jsx'
import TestBatch from '../components/dashboard/TestBatch.jsx'

const Glow = ({ color, className }) => <div className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`} style={{ background: color }} />

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function Dashboard() {
  const [compare, setCompare] = useState(null)
  const [batchOpen, setBatchOpen] = useState(false)
  const [runKey, setRunKey] = useState(0)
  const now = useNow()
  const updated = `${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}, ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}`

  const downloadReport = () => {
    const blob = new Blob([`AiMEND savings report: Northwind Inc.\nLast 30 days\nSaved: $41,286\nWould have paid: $96,400\nActually paid: $55,114\n(Demo data)\n`], { type: 'text/plain' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'aimend-savings-report.txt' })
    a.click()
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-base p-0 md:p-6">
      <Glow color="#0F6C71" className="w-[900px] h-[700px] -top-60 -left-40 opacity-80" />
      <Glow color="#1D5B45" className="w-[700px] h-[600px] top-[30%] right-[-200px] opacity-60" />
      <Glow color="#8A5A22" className="w-[700px] h-[400px] bottom-[-160px] left-[35%] opacity-45" />

      <div className="relative flex min-h-[calc(100vh-48px)] md:rounded-[28px] border border-white/[0.08] bg-black/10 overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <TopBar />
          <main className="px-5 md:px-9 py-7 pb-28 space-y-6 max-w-[1680px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-[40px] num-light">Savings</h1>
                <div className="flex items-center gap-2 text-[13.5px] text-muted mt-1">
                  <span className="w-2 h-2 rounded-full bg-mint" /> Live. Last updated {updated}
                  <span className="ml-2 px-2 py-0.5 rounded-md text-[11.5px] bg-white/[0.06] border border-white/10">Demo data</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button onClick={downloadReport} className="btn-ghost flex items-center gap-2 h-10 px-4 rounded-full text-[14px]"><Download size={15} /> Download report</button>
                <button onClick={() => setBatchOpen(true)} className="btn-ghost flex items-center gap-2 h-10 px-4 rounded-full text-[14px]"><Play size={14} fill="currentColor" /> Run test batch</button>
                <button className="btn-primary flex items-center gap-2 h-10 px-4 rounded-full text-[14px]"><CalendarDays size={15} /> Last 30 days <ChevronDown size={14} /></button>
              </div>
            </div>

            <KpiStrip runKey={runKey} />

            <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-6">
              <SavingsChart />
              <SavingsBreakdown />
            </div>

            <FeaturesTable onCompare={setCompare} />
          </main>
        </div>
      </div>

      <TestBatch open={batchOpen} onClose={() => setBatchOpen(false)} onDone={() => setRunKey((k) => k + 1)} />
      <BeforeAfter feature={compare} onClose={() => setCompare(null)} />
    </div>
  )
}
