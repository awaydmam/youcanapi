import { Link } from 'react-router-dom'
import { Sparkles, ScanFace, Link2, CheckCircle, ArrowRight, Shield, Palette, Shirt, Zap, TrendingDown, Star, CreditCard } from 'lucide-react'
import useStore from '../store'
import { useEffect, useState, useRef } from 'react'

/* Animated counter */
function AnimatedStat({ end, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef()
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = Math.ceil(end / 40)
        const id = setInterval(() => {
          start += step
          if (start >= end) { setVal(end); clearInterval(id) }
          else setVal(start)
        }, 30)
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

const STEPS = [
  { icon: ScanFace, step: '01', title: 'Scan Your Skin DNA', desc: 'Upload a selfie or use your camera. AI analyzes 14 skin markers — type, undertone, sensitivities — in 10 seconds flat.', cls: 'card-feature-yellow' },
  { icon: Link2, step: '02', title: 'Paste Any Product Link', desc: 'Found something on Shopee, Zara, TikTok Shop? Paste the URL. Or upload a screenshot. We handle the rest.', cls: 'card-feature-coral' },
  { icon: CheckCircle, step: '03', title: 'Get Your AI Verdict', desc: 'Virtual Try-On preview + color harmony analysis + fabric safety check. Instant BUY ✅ or SKIP ❌ with alternatives.', cls: 'card-feature-teal' },
]

const FEATURES = [
  { icon: Palette, title: 'Color Science Engine', desc: 'Product colors matched against your skin undertone using dermatologist-grade Fitzpatrick analysis. No more "looks different IRL."', cls: 'card-feature-rose' },
  { icon: Shield, title: 'Fabric Safety Check', desc: 'Sensitive skin? Oily T-zone? We check material compatibility with your actual skin conditions before you commit.', cls: 'card-feature-orange' },
  { icon: Shirt, title: 'Virtual Try-On', desc: 'See exactly how clothes, makeup, and hair colors look on YOU — not a random model. Powered by YouCam AI.', cls: 'card-feature bg-teal-light' },
  { icon: Star, title: 'Smart Alternatives', desc: 'Product doesn\'t match? We suggest alternatives that DO — based on your exact skin tone, undertone, and season palette.', cls: 'card-feature bg-surface-pricing' },
  { icon: CreditCard, title: 'Credit System', desc: '10 free checks on us. No signup needed. Upgrade to Pro for unlimited checks + priority API access + export reports.', cls: 'card-feature' },
  { icon: TrendingDown, title: 'Money Saved Tracker', desc: 'See exactly how much money you\'ve saved by skipping bad purchases. Real stats, real savings.', cls: 'card-feature bg-surface-yellow' },
]

const LOGOS = ['Shopee', 'Tokopedia', 'Zalora', 'ZARA', 'H&M', 'UNIQLO', 'SHEIN', 'TikTok Shop']

export default function Landing() {
  const skinDNA = useStore((s) => s.skinDNA)
  const credits = useStore((s) => s.credits)

  return (
    <div className="bg-canvas">
      {/* Promo Banner — dark strip */}
      <div className="promo-banner">
        <Zap className="w-4 h-4 text-brand-yellow" />
        <span>YouCam API Hackathon 2026 — AI Shopping Companion</span>
        <Link to="/pricing" className="badge-promo ml-2">
          {credits} free credits →
        </Link>
      </div>

      {/* Hero — Miro hero-band-marketing: generous spacing, centered, stark white */}
      <section className="bg-canvas pt-hero-pad pb-section-lg">
        <div className="container-marketing text-center">
          <div className="badge-tag-yellow mb-6 mx-auto">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Shopping Gatekeeper
          </div>

          <h1 className="text-h2 sm:text-disp-lg lg:text-hero text-ink-deep max-w-4xl mx-auto">
            Stop guessing.
            <br />
            <span className="text-brand-yellow-deep">Start glowing.</span>
          </h1>

          <p className="mt-6 text-subtitle text-slate max-w-xl mx-auto">
            Paste any product link. See it on <strong className="text-charcoal">you</strong>. Know if it's right for your skin — before you buy.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={skinDNA ? '/dashboard' : '/scan'} className="btn-primary px-8 py-[14px] text-body-md-medium">
              {skinDNA ? 'Check a Product' : 'Get started free'} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/pricing" className="btn-secondary px-8 py-[14px] text-body-md-medium">
              See pricing
            </Link>
          </div>

          <p className="mt-4 text-caption text-stone">No signup required · 10 free checks · Works with any store</p>
        </div>
      </section>

      {/* Logo Wall — trusted stores */}
      <section className="bg-surface py-section-sm border-y border-hairline-soft">
        <div className="container-marketing">
          <p className="text-center text-micro-up text-stone uppercase tracking-[0.15em] mb-6">WORKS WITH YOUR FAVORITE STORES</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {LOGOS.map((name) => (
              <span key={name} className="text-body-md-medium text-steel">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — dark section with animated counters */}
      <section className="bg-ink py-section">
        <div className="container-marketing">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-on-dark">
            <div>
              <div className="text-stat text-brand-yellow"><AnimatedStat end={30} suffix="%" /></div>
              <div className="text-body-sm text-on-dark-muted mt-2">of online fashion gets returned</div>
            </div>
            <div>
              <div className="text-stat text-brand-coral"><AnimatedStat end={68} suffix="%" /></div>
              <div className="text-body-sm text-on-dark-muted mt-2">due to color / fit mismatch</div>
            </div>
            <div>
              <div className="text-stat text-brand-teal flex items-center justify-center gap-2">
                $<AnimatedStat end={0} />
              </div>
              <div className="text-body-sm text-on-dark-muted mt-2">wasted when you use FIT-CHECK AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works — 3 pastel sticky-note cards */}
      <section id="how-it-works" className="bg-canvas section-lg">
        <div className="container-marketing">
          <div className="text-center mb-section-sm">
            <h2 className="text-h2 sm:text-h1 text-ink-deep">How it works</h2>
            <p className="mt-4 text-subtitle text-slate">Three steps. That's it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {STEPS.map((item, i) => (
              <div key={i} className={`${item.cls} transition-transform duration-200 active:scale-[0.98]`}>
                <div className="w-14 h-14 rounded-xxl bg-canvas/70 flex items-center justify-center mb-5 shadow-subtle">
                  <item.icon className="w-7 h-7 text-ink" />
                </div>
                <div className="text-micro-up text-stone tracking-[0.2em] mb-3">STEP {item.step}</div>
                <h3 className="text-h4 text-ink-deep mb-3">{item.title}</h3>
                <p className="text-body-md text-charcoal leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — 6-up grid, pastel cards */}
      <section className="bg-surface-soft section-lg">
        <div className="container-marketing">
          <div className="text-center mb-section-sm">
            <h2 className="text-h2 sm:text-h1 text-ink-deep">Why FIT-CHECK AI?</h2>
            <p className="mt-4 text-subtitle text-slate">Everything you need to shop smarter.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((item, i) => (
              <div key={i} className={item.cls}>
                <div className="w-12 h-12 rounded-xl bg-canvas/60 flex items-center justify-center mb-4 shadow-subtle">
                  <item.icon className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-h5 text-ink-deep mb-2">{item.title}</h3>
                <p className="text-body-sm text-charcoal leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA banner — cta-banner-dark */}
      <section className="bg-canvas section-md">
        <div className="container-marketing">
          <div className="bg-ink rounded-feature p-section text-center">
            <h2 className="text-h2 sm:text-h1 text-on-dark mb-4">Ready to shop smarter?</h2>
            <p className="text-subtitle text-on-dark-muted max-w-lg mx-auto mb-10">
              Create your free Skin DNA profile in under 30 seconds. No account needed.
            </p>
            <Link to="/scan" className="btn-on-dark px-10 py-[14px] text-body-md-medium">
              Get started free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer — massive dark, multi-column */}
      <footer className="bg-footer-bg text-on-dark">
        <div className="container-marketing py-section">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center font-extrabold text-ink text-sm">F</div>
                <span className="text-body-md-medium text-on-dark">FIT-CHECK AI</span>
              </div>
              <p className="text-body-sm text-on-dark-muted leading-relaxed max-w-xs">AI-powered shopping companion that matches products to your unique skin profile. Built for YouCam API Hackathon 2026.</p>
            </div>
            {[
              { title: 'Product', links: [{ to: '/scan', label: 'Skin DNA Scan' }, { to: '/dashboard', label: 'Check Product' }, { to: '/history', label: 'History' }, { to: '/pricing', label: 'Pricing' }] },
              { title: 'APIs Used', links: [{ label: 'Skin Analysis' }, { label: 'Fitzpatrick Type' }, { label: 'Color Tones' }, { label: 'Apparel VTO' }] },
              { title: 'Resources', links: [{ href: 'https://youcam-api.devpost.com/', label: 'DevPost →' }, { href: 'https://developer.youcam.com/', label: 'YouCam API →' }] },
              { title: 'Legal', links: [{ label: 'Privacy Policy' }, { label: 'Terms of Service' }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-body-md-medium text-on-dark mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      {link.to ? (
                        <Link to={link.to} className="text-body-sm text-on-dark-muted transition-colors duration-150 active:text-on-dark">{link.label}</Link>
                      ) : link.href ? (
                        <a href={link.href} target="_blank" rel="noreferrer" className="text-body-sm text-on-dark-muted transition-colors duration-150 active:text-on-dark">{link.label}</a>
                      ) : (
                        <span className="text-body-sm text-on-dark-muted">{link.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-section-sm pt-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-micro text-on-dark-muted">© 2026 FIT-CHECK AI. Built for YouCam API Hackathon.</span>
            <span className="text-micro text-on-dark-muted">Powered by YouCam Skin AI & Apparel VTO</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
