import { Link } from 'react-router-dom'
import { Sparkles, ScanFace, Link2, CheckCircle, TrendingDown, ArrowRight, Shield, Palette, Shirt } from 'lucide-react'
import useStore from '../store'

export default function Landing() {
  const skinDNA = useStore((s) => s.skinDNA)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-blue-50/40 to-pink-50/30 dark:from-purple-900/20 dark:via-dark-bg dark:to-dark-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pulse-primary/10 text-pulse-primary dark:text-dark-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Shopping Gatekeeper
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Stop Guessing.{' '}
              <span className="bg-gradient-to-r from-pulse-primary to-purple-400 bg-clip-text text-transparent">
                Start Glowing.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-pulse-body dark:text-dark-body max-w-2xl mx-auto leading-relaxed">
              Paste any product link. See it on you. Know if it's right for <strong>YOUR</strong> skin — before you buy.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={skinDNA ? '/dashboard' : '/scan'} className="btn-primary text-lg px-8 py-4">
                {skinDNA ? 'Check a Product' : 'Create Your Skin DNA — Free'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="btn-ghost text-lg">
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-pulse-primary dark:bg-pulse-primary-deep py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            <div>
              <div className="text-3xl font-bold">30%</div>
              <div className="text-sm opacity-80 mt-1">of online fashion gets returned</div>
            </div>
            <div>
              <div className="text-3xl font-bold">68%</div>
              <div className="text-sm opacity-80 mt-1">due to color/fit mismatch</div>
            </div>
            <div>
              <div className="text-3xl font-bold flex items-center justify-center gap-1">
                <TrendingDown className="w-7 h-7" /> $0
              </div>
              <div className="text-sm opacity-80 mt-1">wasted when you use FIT-CHECK AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="mt-4 text-pulse-mute dark:text-dark-mute text-lg">Three steps. That's it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: ScanFace, step: '01', title: 'Scan Your Skin', desc: 'Upload a selfie. Our AI analyzes 14 skin markers to create your unique Skin DNA profile. Takes 10 seconds.' },
              { icon: Link2, step: '02', title: 'Paste Any Product', desc: 'Found something you like? Paste the link from Shopee, Zara, ASOS, TikTok Shop — anywhere. Or upload a photo.' },
              { icon: CheckCircle, step: '03', title: 'Get Your Verdict', desc: 'Instant AI analysis: Virtual Try-On preview, color harmony check, fabric safety score. Buy ✅ or Skip ❌.' },
            ].map((item, i) => (
              <div key={i} className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pulse-primary/10 dark:bg-dark-primary/20 mb-4">
                  <item.icon className="w-8 h-8 text-pulse-primary dark:text-dark-primary" />
                </div>
                <div className="text-xs font-bold text-pulse-primary dark:text-dark-primary tracking-widest mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-pulse-mute dark:text-dark-mute leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-pulse-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Why FIT-CHECK AI?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Palette, title: 'Color Science', desc: 'We match product colors against your skin undertone using dermatologist-verified analysis. No more "looks different in real life."' },
              { icon: Shield, title: 'Fabric Safety', desc: 'Sensitive skin? Oily T-zone? We check fabric compatibility with your actual skin conditions before you buy.' },
              { icon: Shirt, title: 'Virtual Try-On', desc: 'See exactly how it looks on YOU — not a random model. Powered by YouCam AI technology.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-pulse-primary/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-pulse-primary dark:text-dark-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-pulse-mute dark:text-dark-mute text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to shop smarter?</h2>
          <p className="text-lg text-pulse-mute dark:text-dark-mute mb-8">
            Create your free Skin DNA profile in under 30 seconds. No account required.
          </p>
          <Link to="/scan" className="btn-primary text-lg px-8 py-4">
            Create Your Skin DNA — Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pulse-hairline dark:border-dark-hairline py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-pulse-mute dark:text-dark-mute">
            © 2026 FIT-CHECK AI. Built for YouCam API Hackathon.
          </div>
          <div className="flex items-center gap-4 text-sm text-pulse-mute">
            <span>Powered by YouCam Skin AI & Apparel VTO</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
