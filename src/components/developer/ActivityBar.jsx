import { Files, GitBranch, Search, Settings, Blocks } from 'lucide-react'
import Logo from '../Logo.jsx'

export default function ActivityBar() {
  const icons = [Files, Search, GitBranch, Blocks]
  return (
    <div className="w-12 shrink-0 bg-[#333333] flex flex-col items-center py-2 gap-1">
      {icons.map((Icon, i) => (
        <div key={i} className={`w-12 h-12 grid place-items-center ${i === 0 ? 'text-white border-l-2 border-white' : 'text-white/40 hover:text-white/80'}`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
      ))}
      <div title="AiMEND" className="w-12 h-12 grid place-items-center"><Logo className="w-5 h-5" /></div>
      <div className="mt-auto w-12 h-12 grid place-items-center text-white/40"><Settings size={22} strokeWidth={1.5} /></div>
    </div>
  )
}
