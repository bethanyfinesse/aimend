import Drop from '../Drop.jsx'

export default function Toast({ text }) {
  if (!text) return null
  return (
    <div className="frost fade-up fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 text-[14px] text-white">
      <Drop className="w-3.5 h-3.5" /> {text}
    </div>
  )
}
