import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Check, Shield, Palette, Shirt, ArrowLeft, Loader2, Sparkles, Star, ShoppingBag, X, ExternalLink, Repeat2, TrendingUp, Droplets, Sun } from 'lucide-react'
import useStore from '../store'
import { generateVerdict, extractDominantColor, guessFabricType } from '../services/verdict'
import { virtualTryOn } from '../services/youcam'

/* ===================== DEMO DATA ===================== */
const DEMO_ALTERNATIVES = [
  { title: 'Silk Wrap Blouse — Ivory', match: 94, price: 45, img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=300', reason: 'Perfect warm undertone match' },
  { title: 'Linen Midi Dress — Sage', match: 89, price: 62, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300', reason: 'Complements your autumn palette' },
  { title: 'Cotton Tee — Terracotta', match: 86, price: 28, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300', reason: 'Great fabric safety for your skin type' },
]

const DEMO_VTO_TABS = [
  { id: 'apparel', label: 'Apparel', icon: Shirt },
  { id: 'makeup', label: 'Makeup', icon: Droplets },
  { id: 'hair', label: 'Hair Color', icon: Sun },
]

const ANALYSIS_LOADING = [
  { text: 'Scraping product details...', dur: 600 },
  { text: 'Extracting dominant colors...', dur: 800 },
  { text: 'Analyzing fabric composition...', dur: 700 },
  { text: 'Running color harmony check...', dur: 900 },
  { text: 'Computing skin compatibility...', dur: 600 },
  { text: 'Generating Virtual Try-On...', dur: 1100 },
  { text: 'Preparing your verdict...', dur: 500 },
]

function ProgressRing({ value, size = 120, stroke = 8, color }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  const c = color || (value >= 70 ? '#0CA789' : value >= 40 ? '#F5A623' : '#E5484D')
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0F0F0" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-1000 ease-out" />
    </svg>
  )
}

function ScoreBar({ label, score, icon: Icon, iconBg, iconFg }) {
  const color = score >= 70 ? 'bg-success' : score >= 40 ? 'bg-warning' : 'bg-danger'
  const textColor = score >= 70 ? 'text-success' : score >= 40 ? 'text-warning' : 'text-danger'
  return (
    <div className="flex items-start gap-4">
      <div className={`shrink-0 w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconFg}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-body-sm-medium text-ink-deep">{label}</span>
          <span className={`text-caption-bold ${textColor}`}>{score}/100</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-pill overflow-hidden">
          <div className={`h-full rounded-pill ${color} transition-all duration-1000 ease-out`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function Result() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { skinDNA, getCheck, addCheck, selfieUrl, useCredit, formatPrice } = useStore()

  const [loading, setLoading] = useState(true)
  const [loadingStep, setLoadingStep] = useState(0)
  const [check, setCheck] = useState(null)
  const [vtoTab, setVtoTab] = useState('apparel')
  const [showAlternatives, setShowAlternatives] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (id !== 'new') {
        const item = getCheck(id)
        if (item) { setCheck(item); setLoading(false) }
        else navigate('/dashboard')
        return
      }

      const pUrl = searchParams.get('url')
      const pTitle = searchParams.get('title') || 'Unknown Product'
      const pImg = searchParams.get('img') || ''
      if (!pUrl) { navigate('/dashboard'); return }

      setLoading(true)

      // Animated loading steps
      for (let i = 0; i < ANALYSIS_LOADING.length; i++) {
        setLoadingStep(i)
        await new Promise(r => setTimeout(r, ANALYSIS_LOADING[i].dur))
      }

      try {
        useCredit()
        const color = await extractDominantColor(pImg)
        const fabric = guessFabricType(pTitle)
        const product = { title: pTitle, url: pUrl, imageUrl: pImg, dominantColor: color, fabricType: fabric }
        const evaluation = generateVerdict(product, skinDNA)

        let vtoResultUrl = pImg
        try {
          const vtoRes = await virtualTryOn(selfieUrl, pImg)
          vtoResultUrl = vtoRes?.result_image || pImg
        } catch { /* demo fallback */ }

        const priceUSD = Math.floor(Math.random() * 80) + 15
        const newCheck = {
          id: Math.random().toString(36).substring(2, 9),
          createdAt: Date.now(),
          ...product,
          ...evaluation,
          vtoUrl: vtoResultUrl,
          estimatedPrice: priceUSD,
          alternatives: DEMO_ALTERNATIVES.map(a => ({
            ...a,
            match: Math.max(50, Math.min(99, a.match + Math.floor(Math.random() * 10) - 5)),
          })),
        }
        addCheck(newCheck)
        setCheck(newCheck)
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    loadData()
  }, [id, searchParams])

  if (loading) {
    const progress = Math.round(((loadingStep + 1) / ANALYSIS_LOADING.length) * 100)
    return (
      <div className="container-marketing py-section text-center">
        <div className="max-w-md mx-auto">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <ProgressRing value={progress} size={112} stroke={6} color="#2B6BF3" />
            <span className="absolute inset-0 flex items-center justify-center text-h3 text-ink-deep">{progress}%</span>
          </div>
          <h2 className="text-h3 text-ink-deep mb-2">Running FIT-CHECK Engine</h2>
          <p className="text-body-sm text-slate mb-8">Comparing product with your Skin DNA profile</p>
          <div className="space-y-2.5 text-left">
            {ANALYSIS_LOADING.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 px-md py-sm rounded-lg transition-all duration-300 ${
                i < loadingStep ? 'bg-teal-light' : i === loadingStep ? 'bg-surface-yellow' : 'bg-surface-soft'
              }`}>
                <span className="text-body-sm">{i < loadingStep ? '✅' : i === loadingStep ? '⏳' : '⬜'}</span>
                <span className={`text-body-sm flex-1 ${i <= loadingStep ? 'text-ink-deep font-medium' : 'text-stone'}`}>{s.text}</span>
                {i === loadingStep && <Loader2 className="w-4 h-4 text-brand-blue animate-spin" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!check) return null
  const isBuy = check.verdict === 'BUY'
  const glowColor = check.glowScore >= 70 ? '#0CA789' : check.glowScore >= 40 ? '#F5A623' : '#E5484D'

  return (
    <div className="container-marketing py-section-sm sm:py-section">
      <button onClick={() => navigate('/dashboard')} className="btn-ghost text-slate mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* ===== MAIN VERDICT HERO ===== */}
      <div className={`card-feature border-2 mb-8 ${
        isBuy ? 'border-success/30 bg-teal-light/30' : 'border-danger/30 bg-brand-red/30'
      }`}>
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Glow Score Ring */}
          <div className="relative shrink-0">
            <ProgressRing value={check.glowScore} size={160} stroke={10} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-stat text-ink-deep" style={{ fontSize: '48px' }}>{check.glowScore}</span>
              <span className="text-micro-up text-stone uppercase tracking-widest">GLOW</span>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="text-micro-up text-stone uppercase tracking-widest mb-2">FIT-CHECK AI VERDICT</div>
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <span className={`text-h1 ${isBuy ? 'text-success' : 'text-danger'}`}>
                {isBuy ? 'BUY ✅' : 'SKIP ❌'}
              </span>
            </div>
            <p className="text-body-md text-charcoal leading-relaxed max-w-lg bg-canvas p-xl rounded-xl border border-hairline-soft shadow-subtle">
              <Sparkles className="w-5 h-5 inline mr-1.5 text-brand-yellow-deep" />
              {check.recommendation}
            </p>

            {/* Quick stats row */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="badge-tag-yellow">Color: {check.colorScore}/100</span>
              <span className="badge-tag-coral">Fabric: {check.fabricScore}/100</span>
              <span className="badge-tag-purple">Style: {check.styleScore}/100</span>
              {check.estimatedPrice && (
                <span className="badge-tag bg-surface text-charcoal text-caption-bold rounded-pill px-[10px] py-[4px]">
                  {useStore.getState().formatPrice(check.estimatedPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== LEFT: VTO Preview ===== */}
        <div className="lg:col-span-1 space-y-6">
          {/* VTO Tabs */}
          <div className="card-feature !p-0 overflow-hidden">
            <div className="flex border-b border-hairline">
              {DEMO_VTO_TABS.map(tab => (
                <button key={tab.id} onClick={() => setVtoTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-sm text-caption-bold transition-colors duration-150 ${
                    vtoTab === tab.id ? 'bg-ink text-on-dark' : 'text-steel active:bg-surface'
                  }`}>
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>
            <div className="aspect-[3/4] bg-surface relative overflow-hidden">
              {check.vtoUrl || check.imageUrl ? (
                <img src={check.vtoUrl || check.imageUrl} alt="VTO Preview" loading="lazy"
                  className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone">No preview available</div>
              )}
              {/* VTO overlay badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-canvas/95 backdrop-blur px-md py-sm rounded-xl border border-hairline-soft flex items-center justify-between">
                <span className="text-caption-bold text-ink-deep">
                  {vtoTab === 'apparel' ? 'Apparel Try-On' : vtoTab === 'makeup' ? 'Makeup Preview' : 'Hair Color Preview'}
                </span>
                <span className="badge-tag-yellow text-micro">YouCam API</span>
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="card-base">
            <h3 className="text-body-md-medium text-ink-deep mb-2 line-clamp-2">{check.title}</h3>
            {check.url && check.url !== 'upload' && (
              <a href={check.url} target="_blank" rel="noreferrer" className="btn-link text-caption mt-1">
                View original <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* ===== RIGHT: Analysis + Alternatives ===== */}
        <div className="lg:col-span-2 space-y-6">

          {/* Detailed Breakdown */}
          <div className="card-feature">
            <h3 className="text-h5 text-ink-deep mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-blue" /> Analysis Breakdown
            </h3>
            <div className="space-y-5">
              <ScoreBar label="Color Harmony" score={check.colorScore} icon={Palette} iconBg="bg-surface-yellow" iconFg="text-yellow-dark" />
              <p className="text-body-sm text-slate ml-14 -mt-2">{check.reasons?.color}</p>

              <ScoreBar label={`Fabric Safety (${check.fabricType || 'Cotton'})`} score={check.fabricScore} icon={Shield} iconBg="bg-teal-light" iconFg="text-moss-dark" />
              <p className="text-body-sm text-slate ml-14 -mt-2">{check.reasons?.fabric}</p>

              <ScoreBar label="Style Fit" score={check.styleScore} icon={Shirt} iconBg="bg-brand-pink" iconFg="text-coral-dark" />
              <p className="text-body-sm text-slate ml-14 -mt-2">{check.reasons?.style}</p>
            </div>
          </div>

          {/* Skin DNA Match Details */}
          <div className="card-feature bg-surface-yellow/30 border-brand-yellow/20">
            <h3 className="text-h5 text-ink-deep mb-4 flex items-center gap-2">
              🧬 Skin DNA Match Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Skin Type', value: skinDNA?.fitzpatrick?.label || 'Type IV', icon: '🧑' },
                { label: 'Undertone', value: skinDNA?.colorTones?.undertone || 'Warm', icon: '🎨' },
                { label: 'Season', value: skinDNA?.colorTones?.season || 'Autumn', icon: '🍂' },
                { label: 'Match', value: `${check.glowScore}%`, icon: '✨' },
              ].map((s, i) => (
                <div key={i} className="bg-canvas rounded-xl p-sm text-center border border-hairline-soft">
                  <span className="text-lg">{s.icon}</span>
                  <div className="text-micro-up text-stone uppercase tracking-wider mt-1">{s.label}</div>
                  <div className="text-body-sm-medium text-ink-deep capitalize">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Color match row */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div>
                <div className="text-micro-up text-success uppercase tracking-wider mb-1.5">YOUR BEST COLORS</div>
                <div className="flex gap-1">
                  {(skinDNA?.colorTones?.best_colors || []).slice(0, 5).map((hex, i) => (
                    <div key={i} className="w-7 h-7 rounded-lg border border-hairline shadow-subtle" style={{ backgroundColor: hex }} title={skinDNA?.colorTones?.best_color_names?.[i]} />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-micro-up text-danger uppercase tracking-wider mb-1.5">PRODUCT COLOR</div>
                <div className="flex gap-1">
                  <div className="w-7 h-7 rounded-lg border-2 border-ink shadow-subtle" style={{ backgroundColor: check.dominantColor || '#888' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ===== ALTERNATIVES ===== */}
          <div className="card-feature">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h5 text-ink-deep flex items-center gap-2">
                <Repeat2 className="w-5 h-5 text-brand-blue" /> Better Matches For You
              </h3>
              <button onClick={() => setShowAlternatives(!showAlternatives)} className="btn-link text-caption">
                {showAlternatives ? 'Hide' : 'Show all'}
              </button>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${!showAlternatives && check.alternatives?.length > 3 ? 'max-h-[300px] overflow-hidden relative' : ''}`}>
              {(check.alternatives || DEMO_ALTERNATIVES).map((alt, i) => (
                <div key={i} className="card-customer-story group cursor-pointer transition-shadow duration-200 active:shadow-card">
                  <div className="aspect-[4/3] bg-surface overflow-hidden relative">
                    <img src={alt.img} alt={alt.title} loading="lazy"
                      className="w-full h-full object-cover group-active:scale-[1.02] transition-transform duration-300" />
                    <div className="absolute top-2 right-2 badge-success text-micro">
                      {alt.match}% match
                    </div>
                  </div>
                  <div className="p-md">
                    <h4 className="text-body-sm-medium text-ink-deep line-clamp-1">{alt.title}</h4>
                    <p className="text-caption text-slate mt-0.5">{alt.reason}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-body-sm-medium text-ink-deep">{useStore.getState().formatPrice(alt.price)}</span>
                      <span className="badge-tag-yellow text-micro"><Star className="w-3 h-3 inline" /> Recommended</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-section-sm flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => navigate('/dashboard')} className="btn-primary px-8 py-[14px] text-body-md-medium">
          <ShoppingBag className="w-5 h-5" /> Check Another Product
        </button>
        <button onClick={() => navigate('/history')} className="btn-secondary px-8 py-[14px] text-body-md-medium">
          View History
        </button>
      </div>
    </div>
  )
}
