import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useState } from 'react'
import useStore from '../store'

export default function Navbar() {
  const { darkMode, toggleDarkMode, skinDNA } = useStore()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isLanding = location.pathname === '/'

  const links = [
    { to: '/dashboard', label: 'Check Product' },
    { to: '/history', label: 'History' },
    { to: '/profile', label: 'Profile' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — canary yellow wordmark (Miro style) */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-brand-yellow">FIT-CHECK</span>
              <span className="text-ink ml-1">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {!isLanding && links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? 'bg-surface-alt text-ink font-bold'
                    : 'text-mute hover:text-ink hover:bg-surface-alt'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isLanding ? (
              <div className="flex items-center gap-3 ml-4">
                <Link to={skinDNA ? '/dashboard' : '/scan'} className="btn-primary text-sm">
                  Get started free
                </Link>
                <a href="#how-it-works" className="btn-secondary text-sm !border !py-2.5">
                  Book a demo
                </a>
              </div>
            ) : (
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-mute hover:text-ink hover:bg-surface-alt transition-colors ml-2"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setOpen(!open)} className="p-2 rounded-lg text-mute">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-mute hover:text-ink hover:bg-surface-alt"
              >
                {l.label}
              </Link>
            ))}
            <Link to={skinDNA ? '/dashboard' : '/scan'} onClick={() => setOpen(false)} className="block btn-primary mt-2 text-center text-sm">
              Get started free
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
