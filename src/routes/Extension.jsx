import { useEffect, useMemo, useRef, useState } from 'react'
import BrowserBar from '../components/extension/BrowserBar.jsx'
import ChatSidebar from '../components/extension/ChatSidebar.jsx'
import MessageList from '../components/extension/MessageList.jsx'
import Composer from '../components/extension/Composer.jsx'
import StatusPill from '../components/extension/StatusPill.jsx'
import WaterWalletPopup from '../components/extension/WaterWalletPopup.jsx'
import Toast from '../components/extension/Toast.jsx'
import Drop from '../components/Drop.jsx'
import { classify } from '../lib/smartRoute.js'
import { findIssues, trimIssue } from '../lib/ecoPrompt.js'
import { quickAnswer } from '../lib/quickAnswer.js'
import { mockReply } from '../lib/mockReplies.js'
import { isPeakHour, tspFor } from '../lib/water.js'

let nextId = 100
const uid = () => ++nextId

const SEED_MESSAGES = [
  { id: 1, role: 'user', text: "what's 15% of 76.80?" },
  { id: 2, role: 'aimend', prompt: "what's 15% of 76.80?", answer: '11.52', status: 'pending' },
  { id: 3, role: 'user', text: 'Can you help me make a study plan for my finals?' },
  { id: 4, role: 'assistant', text: "Sure. Tell me which classes you have, when your exams are, and how many hours a day you can study, and I'll build a week-by-week plan." },
]
const SEED_INPUT =
  'I have biology, calculus and history exams in two weeks and I can study 3 hours a day. Please note I have biology, calculus and history exams coming up in two weeks. Make me a study plan, and basically just like make it really detailed and stuff if you can please.'

const SAVED_SMART_ROUTE = 2

export default function Extension() {
  const [messages, setMessages] = useState(SEED_MESSAGES)
  const [input, setInput] = useState(SEED_INPUT)
  const [ignored, setIgnored] = useState(new Set())
  const [route, setRoute] = useState(null)
  const [popup, setPopup] = useState(false)
  const [toast, setToast] = useState('')
  const [peakOverride, setPeakOverride] = useState(null)
  const [wallet, setWallet] = useState({
    usedToday: 6.2,
    savedToday: 3.5,
    savedWeek: 404,
    queue: [{ id: 0, text: 'Draft my weekly reflection journal' }],
  })
  const toastTimer = useRef()

  const peak = peakOverride ?? isPeakHour()
  const issues = useMemo(() => findIssues(input).filter((i) => !ignored.has(i.text)), [input, ignored])
  const showChip = route?.simple && route.text === input && input.trim()

  // Smart Route: classify the draft with the in-browser embedding model (debounced).
  useEffect(() => {
    const text = input
    if (!text.trim() || text.length > 200) {
      setRoute(null)
      return
    }
    const id = setTimeout(async () => setRoute({ ...(await classify(text)), text }), 350)
    return () => clearTimeout(id)
  }, [input])

  const flash = (text) => {
    setToast(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2800)
  }
  const addWater = (patch) =>
    setWallet((w) => ({
      ...w,
      usedToday: w.usedToday + (patch.used ?? 0),
      savedToday: w.savedToday + (patch.saved ?? 0),
      savedWeek: w.savedWeek + (patch.saved ?? 0),
    }))

  const replyAfter = (afterId, prompt) => {
    const typingId = uid()
    setMessages((ms) => {
      const i = afterId ? ms.findIndex((m) => m.id === afterId) + 1 : ms.length
      return [...ms.slice(0, i), { id: typingId, role: 'assistant', typing: true }, ...ms.slice(i)]
    })
    setTimeout(() => setMessages((ms) => ms.map((m) => (m.id === typingId ? { ...m, typing: false, text: mockReply(prompt) } : m))), 900)
    addWater({ used: tspFor(prompt) })
  }

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((ms) => [...ms, { id: uid(), role: 'user', text }])
    setInput('')
    replyAfter(null, text)
  }

  const answerWithoutAI = () => {
    const text = input.trim()
    setMessages((ms) => [...ms, { id: uid(), role: 'user', text }, { id: uid(), role: 'aimend', prompt: text, answer: quickAnswer(text), status: 'pending' }])
    setInput('')
  }

  const setCard = (id, status) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, status } : m)))
  const useAnswer = (id) => {
    setCard(id, 'used')
    addWater({ saved: SAVED_SMART_ROUTE })
    flash(`Saved ≈ ${SAVED_SMART_ROUTE} tsp of water`)
  }
  const askAnyway = (id) => {
    const card = messages.find((m) => m.id === id)
    setCard(id, 'asked')
    replyAfter(id, card.prompt)
  }

  const trim = (issue) => {
    setInput(trimIssue(input, issue))
    addWater({ saved: tspFor(issue.text) })
  }
  const sendLater = () => {
    const text = input.trim()
    if (!text) return
    setWallet((w) => ({ ...w, queue: [...w.queue, { id: uid(), text }] }))
    setInput('')
    flash('Saved for 9 PM, a lower-water time')
  }

  const newChat = () => {
    setMessages([])
    setInput('')
  }

  return (
    <div className="h-screen flex flex-col bg-[#212121] text-white">
      <div className="relative">
        <BrowserBar popupOpen={popup} onExtension={() => setPopup(!popup)} />
        {popup && <WaterWalletPopup wallet={wallet} />}
      </div>
      <div className="flex flex-1 min-h-0">
        <ChatSidebar onNewChat={newChat} />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="h-14 shrink-0 flex items-center px-6 text-[17px] font-semibold text-white/90">Assistant</div>
          <div className="flex-1 overflow-y-auto">
            {messages.length ? (
              <MessageList messages={messages} onUse={useAnswer} onAskAI={askAnyway} />
            ) : (
              <div className="h-full grid place-items-center text-[26px] text-white/85">What can I help with?</div>
            )}
          </div>
          <div className="shrink-0 max-w-[780px] w-full mx-auto px-6 pb-24 pt-2">
            {showChip && (
              <button onClick={answerWithoutAI} title={route.method === 'model' ? `MiniLM similarity · simple ${route.simpleScore.toFixed(2)} vs complex ${route.complexScore.toFixed(2)}` : 'Keyword rules (fallback mode)'}
                className="frost !rounded-full fade-up mb-2 inline-flex items-center gap-2 px-3.5 py-1.5 text-[13px] text-white/90 hover:brightness-125">
                <Drop className="w-3 h-3" /> Answer without AI? <span className="text-teal">saves ≈ 2 tsp</span>
              </button>
            )}
            <Composer value={input} onChange={setInput} onSend={send} issues={issues} onTrim={trim} onIgnore={(i) => setIgnored(new Set([...ignored, i.text]))} />
            <div className="mt-2.5 flex justify-center">
              <StatusPill tsp={tspFor(input)} peak={peak} canSend={!!input.trim()} onSendLater={sendLater} onTogglePeak={() => setPeakOverride(!peak)} />
            </div>
          </div>
        </main>
      </div>
      <Toast text={toast} />
    </div>
  )
}
