import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import useStore from '../store'

export default function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { skinDNA } = useStore()

  return (
    <nav className="sticky top-0 z-50 bg-canvas border-b border-hairline backdrop-blur-md bg-white/95">
      <div className="max-w-marketing mx-auto px-xxl">
        <div className="flex justify-between h-[72px] items-center">
          {/* Left: Yellow square Miro-style wordmark + Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 select-none">
              <div className="w-9 h-9 bg-brand-yellow flex items-center justify-center font-extrabold text-ink rounded-lg shadow-sm text-lg tracking-tighter">
                F
              </div>
              <span className="font-extrabold text-xl tracking-tight text-ink flex items-center gap-1">
                FIT-CHECK <span className="text-brand-yellow-deep font-black">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/scan" className="text-body-sm-medium text-charcoal hover:text-brand-blue transition-colors">Skin DNA</Link>
              <Link to="/dashboard" className="text-body-sm-medium text-charcoal hover:text-brand-blue transition-colors">Check Product</Link>
              <Link to="/history" className="text-body-sm-medium text-charcoal hover:text-brand-blue transition-colors">History</Link>
              <Link to="/pricing" className="text-body-sm-medium text-charcoal hover:text-brand-blue transition-colors">Pricing</Link>
              <Link to="/profile" className="text-body-sm-medium text-charcoal hover:text-brand-blue transition-colors">Profile</Link>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <span className="text-body-sm-medium text-steel">YouCam SDK v1.5</span>
            <Link 
              to={skinDNA ? '/dashboard' : '/scan'} 
              className="btn-primary py-2.5 px-5 text-sm"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn-icon-circular"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-hairline bg-canvas px-6 py-6 space-y-4 shadow-modal">
          <div className="flex flex-col gap-4">
            <Link 
              to="/scan" 
              onClick={() => setIsOpen(false)}
              className="text-body-md-medium text-ink hover:text-brand-blue py-2"
            >
              Skin DNA Scan
            </Link>
            <Link 
              to="/dashboard" 
              onClick={() => setIsOpen(false)}
              className="text-body-md-medium text-ink hover:text-brand-blue py-2"
            >
              Check Product
            </Link>
            <Link 
              to="/history" 
              onClick={() => setIsOpen(false)}
              className="text-body-md-medium text-ink hover:text-brand-blue py-2"
            >
              Check History
            </Link>
            <Link 
              to="/profile" 
              onClick={() => setIsOpen(false)}
              className="text-body-md-medium text-ink hover:text-brand-blue py-2"
            >
              My Profile
            </Link>
          </div>
          <div className="border-t border-hairline pt-4 flex flex-col gap-3">
            <div className="text-xs text-steel">Running in Dev/Test Mode</div>
            <Link 
              to={skinDNA ? '/dashboard' : '/scan'} 
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full text-center py-3"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
