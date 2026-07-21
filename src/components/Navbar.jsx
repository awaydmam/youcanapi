import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Dna, Menu, X } from 'lucide-react'
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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-pulse-surface/80 dark:bg-dark-surface/80 border-b border-pulse-hairline dark:border-dark-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pulse-primary to-purple-400 flex items-center justify-center">
              <Dna className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-pulse-ink dark:text-dark-ink">
              FIT-CHECK <span className="text-pulse-primary dark:text-dark-primary">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {!isLanding && links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? 'bg-pulse-primary/10 text-pulse-primary dark:text-dark-primary'
                    : 'text-pulse-mute hover:text-pulse-ink dark:text-dark-mute dark:hover:text-dark-ink hover:bg-pulse-surface-dark dark:hover:bg-dark-surface'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-pulse-mute hover:text-pulse-ink dark:text-dark-mute dark:hover:text-dark-ink hover:bg-pulse-surface-dark dark:hover:bg-dark-surface transition-colors ml-2"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isLanding && (
              <Link to={skinDNA ? '/dashboard' : '/scan'} className="btn-primary ml-3 text-sm">
                {skinDNA ? 'Dashboard' : 'Get Started'}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-md text-pulse-mute">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setOpen(!open)} className="p-2 rounded-md text-pulse-mute">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-md text-sm font-medium text-pulse-mute hover:text-pulse-ink hover:bg-pulse-surface-dark"
              >
                {l.label}
              </Link>
            ))}
            {isLanding && (
              <Link to={skinDNA ? '/dashboard' : '/scan'} onClick={() => setOpen(false)} className="block btn-primary mt-2 text-center text-sm">
                {skinDNA ? 'Dashboard' : 'Get Started'}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
