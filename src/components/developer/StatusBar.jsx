import { GitBranch } from 'lucide-react'
import Logo from '../Logo.jsx'

export default function StatusBar({ suggestions, language }) {
  return (
    <div className="h-[24px] shrink-0 flex items-center justify-between px-2 text-[12px] text-white/85 bg-[#1f2a2b] border-t border-white/[0.06]">
      <div className="flex items-center gap-1 px-1.5"><GitBranch size={12} /> main</div>
      <div className="flex items-center gap-3">
        <span className="text-white/60">{language === 'json' ? 'JSON' : 'TypeScript'}</span>
        <span className="flex items-center gap-1.5 px-2 h-[20px] rounded bg-white/[0.07] border border-white/[0.12]" title="AiMEND gateway plugin">
          <Logo className="w-3 h-3" /> AiMEND · $38 saved this month · {suggestions} suggestion{suggestions === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}
