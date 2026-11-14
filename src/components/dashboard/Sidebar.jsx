import { BarChart3, Clock, Settings, Split, Users } from 'lucide-react'
import Logo from '../Logo.jsx'

const ITEMS = [
  { icon: BarChart3, label: 'Savings', active: true },
  { icon: Users, label: 'Teams' },
  { icon: Split, label: 'Routing rules' },
  { icon: Clock, label: 'Peak queue' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-[68px] shrink-0 flex-col items-center py-5 gap-3 border-r border-white/[0.07]">
      <div className="w-10 h-10 grid place-items-center mb-3">
        <Logo className="w-6 h-6" />
      </div>
      {ITEMS.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          title={label}
          className={`w-10 h-10 grid place-items-center rounded-xl transition ${
            active ? 'bg-white/[0.08] text-teal' : 'text-muted hover:text-ink hover:bg-white/5'
          }`}
        >
          <Icon size={18} strokeWidth={1.75} />
        </button>
      ))}
      <button title="Settings" className="mt-auto w-10 h-10 grid place-items-center rounded-xl text-muted hover:text-ink">
        <Settings size={18} strokeWidth={1.75} />
      </button>
    </aside>
  )
}
