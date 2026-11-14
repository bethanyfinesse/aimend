import { useEffect, useRef } from 'react'
import AimendAnswerCard from './AimendAnswerCard.jsx'

export default function MessageList({ messages, onUse, onAskAI }) {
  const end = useRef(null)
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="max-w-[780px] mx-auto px-6 py-6 space-y-6">
      {messages.map((m) => {
        if (m.role === 'user')
          return (
            <div key={m.id} className="flex justify-end fade-up">
              <div className="max-w-[75%] bg-[#2f2f2f] rounded-3xl px-5 py-2.5 text-[15px] text-white/90 whitespace-pre-wrap">{m.text}</div>
            </div>
          )
        if (m.role === 'aimend')
          return <AimendAnswerCard key={m.id} answer={m.answer} status={m.status} onUse={() => onUse(m.id)} onAskAI={() => onAskAI(m.id)} />
        return (
          <div key={m.id} className="fade-up text-[15px] leading-7 text-white/90 whitespace-pre-wrap">
            {m.typing ? <span className="inline-flex gap-1"><Dot /><Dot d=".15s" /><Dot d=".3s" /></span> : m.text}
          </div>
        )
      })}
      <div ref={end} />
    </div>
  )
}

const Dot = ({ d = '0s' }) => <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: d }} />
