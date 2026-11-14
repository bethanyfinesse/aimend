import { useModelStatus } from '../lib/smartRoute.js'

export default function ModelBadge() {
  const { status, progress } = useModelStatus()
  const cfg = {
    loading: { dot: '#F5C27A', text: `Loading AiMEND model${progress ? ` · ${progress}%` : '…'}` },
    ready: { dot: '#9EE6B9', text: 'AiMEND model ready' },
    fallback: { dot: '#F5C27A', text: 'Fallback mode' },
  }[status]
  return (
    <div
      title={status === 'fallback' ? 'Model could not load; Smart Route is using keyword rules' : 'Xenova/all-MiniLM-L6-v2 running in your browser'}
      className="fixed bottom-9 right-5 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full text-[11.5px] text-muted"
      style={{ background: 'rgba(10,18,20,0.72)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'loading' ? 'animate-pulse' : ''}`} style={{ background: cfg.dot }} />
      {cfg.text}
    </div>
  )
}
