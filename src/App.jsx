import { Navigate, Route, Routes } from 'react-router-dom'
import FloatingNav from './components/FloatingNav.jsx'
import ModelBadge from './components/ModelBadge.jsx'
import Dashboard from './routes/Dashboard.jsx'
import Extension from './routes/Extension.jsx'
import Developer from './routes/Developer.jsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/extension" element={<Extension />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <FloatingNav />
      <ModelBadge />
    </>
  )
}
