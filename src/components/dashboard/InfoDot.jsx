import { Info } from 'lucide-react'

export default function InfoDot({ tip }) {
  return (
    <span title={tip} className="inline-flex text-muted/80 cursor-help">
      <Info size={13} strokeWidth={1.75} />
    </span>
  )
}
