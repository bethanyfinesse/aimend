import Drop from '../Drop.jsx'

export default function AimendAnswerCard({ answer, status, onUse, onAskAI }) {
  return (
    <div className="frost fade-up max-w-[520px] p-4">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-teal">
        <Drop className="w-3 h-3" /> Answered by AiMEND, no AI needed
      </div>
      {answer ? (
        <>
          <div className="text-[30px] num-light mt-1 text-white">{answer}</div>
          <div className="text-[13px] text-teal/90">Saved ≈ 2 tsp of water</div>
        </>
      ) : (
        <div className="text-[14px] text-white/80 mt-2">This looks simple, but AiMEND doesn't have an offline answer for it.</div>
      )}
      {status === 'pending' ? (
        <div className="flex gap-2 mt-3">
          {answer && <button onClick={onUse} className="px-3.5 py-1.5 rounded-full text-[13px] pill-teal font-medium hover:brightness-125">Use this</button>}
          <button onClick={onAskAI} className="px-3.5 py-1.5 rounded-full text-[13px] btn-ghost">Ask AI anyway</button>
        </div>
      ) : (
        <div className="mt-2 text-[12px] text-white/45">{status === 'used' ? 'Used AiMEND answer · 2 tsp added to your savings' : 'Sent to AI instead'}</div>
      )}
    </div>
  )
}
