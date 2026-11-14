import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowUp, Plus } from 'lucide-react'
import EcoCard from './EcoCard.jsx'

const SHARED = 'px-5 pt-4 pb-2 text-[15px] leading-[1.75] whitespace-pre-wrap break-words'

/** Textarea with a mirrored layer behind it that draws EcoPrompt's dotted underlines. */
export default function Composer({ value, onChange, onSend, issues, onTrim, onIgnore }) {
  const [openIdx, setOpenIdx] = useState(null)
  const [cardPos, setCardPos] = useState(null)
  const wrap = useRef(null)
  const marks = useRef({})

  const open = openIdx != null ? issues[openIdx] : null

  useLayoutEffect(() => {
    if (open == null) return
    const el = marks.current[openIdx]
    if (!el || !wrap.current) {
      setOpenIdx(null)
      return
    }
    const w = wrap.current.getBoundingClientRect()
    const r = el.getClientRects()[0] ?? el.getBoundingClientRect()
    setCardPos({ left: Math.max(0, Math.min(r.left - w.left, w.width - 300)), bottom: w.bottom - r.top + 10 })
  }, [openIdx, open, value])

  const handleClick = (e) => {
    const pos = e.target.selectionStart
    const idx = issues.findIndex((i) => pos >= i.start && pos <= i.end)
    setOpenIdx(idx >= 0 ? idx : null)
  }

  // Build the mirrored text with marked spans.
  const parts = []
  let cursor = 0
  issues.forEach((iss, i) => {
    parts.push(value.slice(cursor, iss.start))
    parts.push(
      <span key={i} ref={(el) => (marks.current[i] = el)} className="eco-mark">
        {value.slice(iss.start, iss.end)}
      </span>,
    )
    cursor = iss.end
  })
  parts.push(value.slice(cursor) + '\n')

  return (
    <div ref={wrap} className="relative rounded-[26px] bg-[#2f2f2f] border border-white/[0.06]">
      {open && cardPos && (
        <EcoCard
          issue={open}
          style={cardPos}
          onTrim={() => (onTrim(open), setOpenIdx(null))}
          onIgnore={() => (onIgnore(open), setOpenIdx(null))}
        />
      )}
      <div className="grid">
        <div aria-hidden className={`${SHARED} [grid-area:1/1] text-transparent pointer-events-none`}>{parts}</div>
        <textarea
          value={value}
          rows={1}
          placeholder="Ask anything"
          onChange={(e) => (onChange(e.target.value), setOpenIdx(null))}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
            if (e.key === 'Escape') setOpenIdx(null)
          }}
          className={`${SHARED} [grid-area:1/1] bg-transparent resize-none outline-none overflow-hidden text-white/90 placeholder:text-white/40 caret-white`}
        />
      </div>
      <div className="flex items-center justify-between px-3 pb-3">
        <button className="w-9 h-9 grid place-items-center rounded-full border border-white/15 text-white/70 hover:bg-white/5"><Plus size={17} /></button>
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="w-9 h-9 grid place-items-center rounded-full bg-white text-black disabled:opacity-30"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  )
}
