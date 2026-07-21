import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Check, Shield, Palette, Shirt, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import useStore from '../store'
import { generateVerdict, extractDominantColor, guessFabricType } from '../services/verdict'
import { virtualTryOn } from '../services/youcam'

export default function Result() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { skinDNA, getCheck, addCheck, selfieUrl } = useStore()

  const [loading, setLoading] = useState(true)
  const [check, setCheck] = useState(null)
  const [vtoImage, setVtoImage] = useState(null)

  useEffect(() => {
    async function loadData() {
      if (id !== 'new') {
        const item = getCheck(id)
        if (item) {
          setCheck(item)
          setVtoImage(item.vtoUrl)
          setLoading(false)
        } else {
          navigate('/dashboard')
        }
        return
      }

      const pUrl = searchParams.get('url')
      const pTitle = searchParams.get('title') || 'Unknown Product'
      const pImg = searchParams.get('img') || ''

      if (!pUrl) {
        navigate('/dashboard')
        return
      }

      try {
        setLoading(true)
        const color = await extractDominantColor(pImg)
        const fabric = guessFabricType(pTitle)

        const product = {
          title: pTitle,
          url: pUrl,
          imageUrl: pImg,
          dominantColor: color,
          fabricType: fabric,
        }

        const evaluation = generateVerdict(product, skinDNA)

        let vtoResultUrl = null
        try {
          const vtoRes = await virtualTryOn(selfieUrl, pImg)
          vtoResultUrl = vtoRes.result_image || pImg
        } catch {
          vtoResultUrl = pImg
        }

        const newCheck = {
          id: Math.random().toString(36).substring(7),
          createdAt: Date.now(),
          ...product,
          ...evaluation,
          vtoUrl: vtoResultUrl,
          estimatedPrice: 35,
        }

        addCheck(newCheck)
        setCheck(newCheck)
        setVtoImage(newCheck.vtoUrl)
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    loadData()
  }, [id, searchParams])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-brand-blue animate-spin mb-4" />
        <h2 className="text-xl font-extrabold text-ink">Running FIT-CHECK AI Engine...</h2>
        <p className="text-mute text-sm mt-1">Comparing product with your Skin DNA profile</p>
      </div>
    )
  }

  if (!check) return null
  const isBuy = check.verdict === 'BUY'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-mute hover:text-ink mb-8 font-bold text-sm">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: VTO */}
        <div className="space-y-6">
          <div className="card p-0 overflow-hidden relative border-2 border-hairline shadow-sm rounded-3xl">
            <div className="aspect-[3/4] bg-surface-alt flex items-center justify-center">
              {vtoImage ? (
                <img src={vtoImage} alt="Virtual Try-On" className="w-full h-full object-cover" />
              ) : (
                <div className="text-mute">Image not available</div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur px-4 py-3 rounded-2xl border border-hairline flex items-center justify-between">
              <span className="text-sm font-bold text-ink">Virtual Try-On Preview</span>
              <span className="tag-yellow">YouCam API v1</span>
            </div>
          </div>
        </div>

        {/* Right Column: Verdict */}
        <div className="space-y-6">
          {/* Main Verdict Card — pastel styling */}
          <div className={`card p-8 rounded-3xl border-2 ${
            isBuy ? 'border-success/30 bg-teal-light/40' : 'border-danger/30 bg-coral-light/40'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xs font-extrabold text-mute uppercase tracking-[0.2em]">FIT-CHECK VERDICT</h1>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className={`text-4xl font-extrabold ${isBuy ? 'text-success' : 'text-danger'}`}>
                    {isBuy ? 'BUY ✅' : 'SKIP ❌'}
                  </span>
                  <span className="text-sm text-mute">Glow Score: {check.glowScore}/100</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-hairline">
                <span className="text-3xl font-extrabold text-ink">{check.glowScore}</span>
                <span className="text-[10px] font-extrabold text-mute leading-none">GLOW<br />SCORE</span>
              </div>
            </div>

            <div className="h-1.5 bg-hairline rounded-full overflow-hidden mb-6">
              <div
                className={`h-full ${isBuy ? 'bg-success' : 'bg-danger'}`}
                style={{ width: `${check.glowScore}%` }}
              />
            </div>

            <p className="text-ink font-semibold leading-relaxed bg-white p-5 rounded-2xl border border-hairline shadow-sm">
              <Sparkles className="w-5 h-5 inline mr-1.5 text-brand-yellow-deep shrink-0" />
              {check.recommendation}
            </p>
          </div>

          {/* Breakdown Section */}
          <div className="card rounded-3xl space-y-6">
            <h3 className="font-extrabold text-lg text-ink">Analysis Breakdown</h3>
            <div className="space-y-5">
              {/* Color Harmony */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-yellow-light flex items-center justify-center">
                  <Palette className="w-5 h-5 text-yellow-dark" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ink">Color Harmony</span>
                    <span className="badge-yellow">{check.colorScore}/100</span>
                  </div>
                  <p className="text-sm text-mute mt-1 leading-relaxed">{check.reasons.color}</p>
                </div>
              </div>

              {/* Fabric Safety */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center">
                  <Shield className="w-5 h-5 text-moss-dark" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ink">Fabric Safety ({check.fabricType})</span>
                    <span className="badge bg-teal-light text-moss-dark text-xs font-bold rounded-pill">{check.fabricScore}/100</span>
                  </div>
                  <p className="text-sm text-mute mt-1 leading-relaxed">{check.reasons.fabric}</p>
                </div>
              </div>

              {/* Style Fit */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-coral-dark" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ink">Style Fit</span>
                    <span className="badge bg-brand-pink text-coral-dark text-xs font-bold rounded-pill">{check.styleScore}/100</span>
                  </div>
                  <p className="text-sm text-mute mt-1 leading-relaxed">{check.reasons.style}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
