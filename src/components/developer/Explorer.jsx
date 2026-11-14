import { ChevronDown, FileJson, FileCode2 } from 'lucide-react'

export default function Explorer({ files, active, onOpen }) {
  return (
    <div className="hidden sm:block w-[220px] shrink-0 bg-[#252526] text-[13px] text-white/80 select-none">
      <div className="h-9 px-5 flex items-center text-[11px] tracking-wider text-white/60">EXPLORER</div>
      <div className="px-2 flex items-center gap-1 h-6 font-semibold text-[11px] tracking-wide"><ChevronDown size={14} /> SALES-APP</div>
      <div className="px-2 flex items-center gap-1 h-6 pl-4"><ChevronDown size={14} /> src</div>
      {Object.keys(files).map((name) => {
        const Icon = name.endsWith('.json') ? FileJson : FileCode2
        return (
          <div
            key={name}
            onClick={() => onOpen(name)}
            className={`flex items-center gap-1.5 h-[22px] pl-10 cursor-pointer ${active === name ? 'bg-[#37373d] text-white' : 'hover:bg-white/5'}`}
          >
            <Icon size={14} className={name.endsWith('.json') ? 'text-amber' : 'text-[#4fa3e0]'} /> {name}
          </div>
        )
      })}
    </div>
  )
}
