import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Scan from './pages/Scan'
import Dashboard from './pages/Dashboard'
import Result from './pages/Result'
import History from './pages/History'
import Profile from './pages/Profile'
import Pricing from './pages/Pricing'

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </div>
  )
}
