import { Plus } from 'lucide-react'

const HISTORY = {
  Today: ['Study plan for finals', 'Tip calculator question'],
  Yesterday: ['Cover letter draft', 'Explain photosynthesis', 'Weekend trip ideas'],
}

export default function ChatSidebar({ onNewChat }) {
  return (
    <aside className="hidden md:flex w-[260px] shrink-0 flex-col bg-[#171717] px-3 py-3 text-[14px]">
      <button onClick={onNewChat} className="flex items-center gap-2 h-10 px-3 rounded-lg bg-white/[0.06] hover:bg-white/10 text-white/90">
        <Plus size={15} /> New chat
      </button>
      {Object.entries(HISTORY).map(([group, items]) => (
        <div key={group} className="mt-5">
          <div className="px-3 mb-1 text-[12px] text-white/40">{group}</div>
          {items.map((t, i) => (
            <div key={t} className={`px-3 py-2 rounded-lg cursor-pointer truncate ${group === 'Today' && i === 0 ? 'bg-white/[0.07] text-white/90' : 'text-white/75 hover:bg-white/5'}`}>
              {t}
            </div>
          ))}
        </div>
      ))}
    </aside>
  )
}
