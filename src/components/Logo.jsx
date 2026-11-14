import logo from '../assets/logo.svg'

export default function Logo({ className = 'w-3.5 h-3.5' }) {
  return <img src={logo} alt="AiMEND" className={className} />
}
