import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="btn-ghost flex items-center gap-1.5 h-9 px-3 rounded-xl text-[13px]">
        {value} <ChevronDown size={13} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 z-20 min-w-full rounded-xl p-1 bg-[#13201f] border border-white/10 shadow-xl">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => (onChange?.(o), setOpen(false))}
              className={`block w-full text-left whitespace-nowrap px-3 py-1.5 rounded-lg text-[13px] ${o === value ? 'text-teal' : 'text-ink'} hover:bg-white/5`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
