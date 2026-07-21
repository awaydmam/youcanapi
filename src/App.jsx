import { Routes, Route } from 'react-router-dom'
import useStore from './store'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Scan from './pages/Scan'
import Dashboard from './pages/Dashboard'
import Result from './pages/Result'
import History from './pages/History'
import Profile from './pages/Profile'

export default function App() {
  const darkMode = useStore((s) => s.darkMode)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-pulse-bg dark:bg-dark-bg text-pulse-ink dark:text-dark-ink transition-colors">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  )
}
