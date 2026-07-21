import { Link } from 'react-router-dom'
import { Sparkles, ScanFace, Link2, CheckCircle, ArrowRight, Shield, Palette, Shirt, Zap, TrendingDown } from 'lucide-react'
import useStore from '../store'

const PASTEL_CARDS = [
  { cls: 'card-yellow', icon: ScanFace, step: '01', title: 'Scan Your Skin', desc: 'Upload a selfie. Our AI analyzes 14 skin markers to create your unique Skin DNA profile. Takes 10 seconds.' },
  { cls: 'card-coral', icon: Link2, step: '02', title: 'Paste Any Product', desc: 'Found something you like on Shopee, Zara, TikTok Shop? Paste the link. Or just upload a product photo.' },
  { cls: 'card-teal', icon: CheckCircle, step: '03', title: 'Get Your Verdict', desc: 'Instant AI analysis: Virtual Try-On preview, color harmony check, fabric safety score. Buy ✅ or Skip ❌.' },
]

const FEATURES = [
  { cls: 'card-rose', icon: Palette, title: 'Color Science', desc: 'Product colors matched against your skin undertone using dermatologist-verified analysis. No more "looks different in real life."' },
  { cls: 'card-orange', icon: Shield, title: 'Fabric Safety', desc: 'Sensitive skin? Oily T-zone? We check fabric compatibility with your actual skin conditions before you buy.' },
  { cls: 'card-teal', icon: Shirt, title: 'Virtual Try-On', desc: 'See exactly how it looks on YOU — not a random model. Powered by YouCam AI technology.' },
]

export default function Landing() {
  const skinDNA = useStore((s) => s.skinDNA)

  return (
    <div className="bg-white">
      {/* Promo banner — brand yellow */}
      <div className="bg-brand-yellow text-yellow-dark text-center py-2.5 text-sm font-bold tracking-wide">
        <Zap className="w-4 h-4 inline mr-1" />
        YouCam API Hackathon 2026 — AI-Powered Shopping Gatekeeper
      </div>

      {/* Hero — stark white canvas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="text-center max-w-3xl mx-auto">
          <div className="tag-yellow mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI Shopping Companion
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-extrabold tracking-tight leading-[1.05] text-ink">
            Stop guessing.
            <br />
            Start glowing.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-body max-w-xl mx-auto leading-relaxed">
            Paste any product link. See it on you. Know if it's right for <strong>your</strong> skin — before you buy.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={skinDNA ? '/dashboard' : '/scan'} className="btn-primary text-base px-8 py-4">
              {skinDNA ? 'Check a Product' : 'Get started free'}
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base">
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Stats — dark section */}
      <section className="bg-ink py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-extrabold">30%</div>
              <div className="text-sm opacity-60 mt-1">of online fashion gets returned</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold">68%</div>
              <div className="text-sm opacity-60 mt-1">due to color / fit mismatch</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold flex items-center justify-center gap-1">
                <TrendingDown className="w-8 h-8" /> $0
              </div>
              <div className="text-sm opacity-60 mt-1">wasted when you use FIT-CHECK AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works — pastel sticky-note cards */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink">How it works</h2>
            <p className="mt-4 text-mute text-lg">Three steps. That's it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {PASTEL_CARDS.map((item, i) => (
              <div key={i} className={`card ${item.cls} p-8 rounded-3xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center mb-5 shadow-sm">
                  <item.icon className="w-7 h-7 text-ink" />
                </div>
                <div className="text-xs font-extrabold text-mute tracking-[0.2em] mb-3">STEP {item.step}</div>
                <h3 className="text-xl font-extrabold text-ink mb-3">{item.title}</h3>
                <p className="text-body leading-relaxed text-[15px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — pastel cards */}
      <section className="section-padding bg-surface-alt">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink">Why FIT-CHECK AI?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((item, i) => (
              <div key={i} className={`card ${item.cls} p-8 rounded-3xl`}>
                <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center mb-4 shadow-sm">
                  <item.icon className="w-6 h-6 text-ink" />
                </div>
                <h3 className="font-extrabold text-lg text-ink mb-2">{item.title}</h3>
                <p className="text-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mb-4">Ready to shop smarter?</h2>
          <p className="text-lg text-mute mb-10">
            Create your free Skin DNA profile in under 30 seconds. No account required.
          </p>
          <Link to="/scan" className="btn-primary text-base px-10 py-4">
            Get started free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer — massive dark (Miro style) */}
      <footer className="bg-footer-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-extrabold text-sm mb-4 text-brand-yellow">FIT-CHECK AI</h4>
              <p className="text-sm text-white/50 leading-relaxed">AI-powered shopping companion that matches products to your unique skin profile.</p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-white/40">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/scan" className="hover:text-white transition-colors">Skin DNA Scan</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Check Product</Link></li>
                <li><Link to="/history" className="hover:text-white transition-colors">History</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-white/40">APIs Used</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>YouCam Skin Analysis</li>
                <li>Fitzpatrick Skin Type</li>
                <li>Facial Color Tones</li>
                <li>Apparel VTO</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-white/40">Hackathon</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="https://youcam-api.devpost.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">DevPost →</a></li>
                <li><a href="https://developer.youcam.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">YouCam API →</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/40">© 2026 FIT-CHECK AI. Built for YouCam API Hackathon.</div>
            <div className="text-sm text-white/40">Powered by YouCam Skin AI & Apparel VTO</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
