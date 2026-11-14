export default function Drop({ className = 'w-3.5 h-3.5', color = '#5FD0CB' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill={color} d="M12 2.5c-.3 0-.6.2-.8.4C9 5.9 5 11.2 5 15a7 7 0 0 0 14 0c0-3.8-4-9.1-6.2-12.1a1 1 0 0 0-.8-.4z" />
    </svg>
  )
}
