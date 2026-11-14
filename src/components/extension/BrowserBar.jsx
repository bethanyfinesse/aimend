import Logo from '../Logo.jsx'

export default function BrowserBar({ onExtension, popupOpen }) {
  return (
    <div className="flex items-center gap-3 h-12 px-4 bg-[#2a2a2a] border-b border-black/40">
      <div className="flex gap-2">
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="w-3 h-3 rounded-full opacity-60" style={{ background: c }} />)}
      </div>
      <div className="flex-1 h-8 rounded-lg bg-[#1d1d1d] text-[13px] text-white/50 flex items-center px-3">chat.example.com</div>
      <button
        onClick={onExtension}
        title="AiMEND"
        className={`w-9 h-9 grid place-items-center rounded-lg border transition ${popupOpen ? 'border-teal/60 bg-teal/10' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}
      >
        <Logo className="w-4 h-4" />
      </button>
    </div>
  )
}
