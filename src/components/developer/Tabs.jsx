import { X } from 'lucide-react'

export default function Tabs({ tabs, active, onSelect, onClose }) {
  return (
    <div className="h-9 shrink-0 flex bg-[#252526] overflow-x-auto">
      {tabs.map((t) => (
        <div
          key={t}
          onClick={() => onSelect(t)}
          className={`group flex items-center gap-2 px-3.5 text-[13px] cursor-pointer border-r border-black/30 ${
            t === active ? 'bg-[#1e1e1e] text-white border-t border-t-teal' : 'bg-[#2d2d2d] text-white/55'
          }`}
        >
          {t}
          <button onClick={(e) => (e.stopPropagation(), onClose(t))} className="opacity-0 group-hover:opacity-70 hover:!opacity-100">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
