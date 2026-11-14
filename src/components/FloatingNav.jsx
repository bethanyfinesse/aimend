import { NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'

const LINKS = [
  ['/extension', 'Extension'],
  ['/developer', 'Developer'],
  ['/dashboard', 'Dashboard'],
]

export default function FloatingNav() {
  return (
    <nav
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 p-1.5 rounded-full text-[13px]"
      style={{
        background: 'rgba(10,18,20,0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      }}
    >
      <span className="flex items-center gap-1.5 pl-3 pr-2 text-ink font-semibold">
        <Logo /> AiMEND
      </span>
      {LINKS.map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `px-3.5 py-1.5 rounded-full transition ${isActive ? 'btn-primary' : 'text-muted hover:text-ink hover:bg-white/5'}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
