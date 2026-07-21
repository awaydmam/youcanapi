import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Check, X, Shield, Palette, Shirt, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import useStore from '../store'
import { generateVerdict, extractDominantColor, guessFabricType } from '../services/verdict'
import { virtualTryOn } from '../services/youcam'
import clsx from 'clsx'

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
      // 1. Existing check from History
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

      // 2. New check from URL params
      const pUrl = searchParams.get('url')
      const pTitle = searchParams.get('title') || 'Unknown Product'
      const pImg = searchParams.get('img') || ''

      if (!pUrl) {
        navigate('/dashboard')
        return
      }

      try {
        setLoading(true)

        // Run analysis workflows
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

        // Try to trigger VTO
        let vtoResultUrl = null
        try {
          const vtoRes = await virtualTryOn(selfieUrl, pImg)
          vtoResultUrl = vtoRes.result_image || pImg // Fallback to product image for demo
        } catch (e) {
          vtoResultUrl = pImg
        }

        const newCheck = {
          id: Math.random().toString(36).substring(7),
          createdAt: Date.now(),
          ...product,
          ...evaluation,
          vtoUrl: vtoResultUrl,
          estimatedPrice: 35, // Static for MVP calculation
        }

        addCheck(newCheck)
        setCheck(newCheck)
        setVtoImage(newCheck.vtoUrl)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }
    loadData()
  }, [id, searchParams])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-pulse-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold">Running FIT-CHECK AI Engine...</h2>
        <p className="text-pulse-mute text-sm mt-1">Comparing product with your Skin DNA profile</p>
      </div>
    )
  }

  if (!check) return null

  const isBuy = check.verdict === 'BUY'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-pulse-mute hover:text-pulse-ink mb-8 font-medium">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Visual Try-On */}
        <div className="space-y-6">
          <div className="card p-0 overflow-hidden relative border-2 border-pulse-primary/10 shadow-lg">
            <div className="aspect-[3/4] bg-pulse-surface-dark dark:bg-dark-surface flex items-center justify-center">
              {vtoImage ? (
                <img src={vtoImage} alt="Virtual Try-On" className="w-full h-full object-cover" />
              ) : (
                <div className="text-pulse-mute">Image not available</div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-pulse-surface/90 dark:bg-dark-surface/90 backdrop-blur px-4 py-3 rounded-lg border border-pulse-hairline flex items-center justify-between">
              <span className="text-sm font-semibold">Virtual Try-On Preview</span>
              <span className="text-xs bg-pulse-primary/10 text-pulse-primary px-2.5 py-0.5 rounded-full font-bold">YouCam API v1</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Verdict */}
        <div className="space-y-6">
          {/* Main Verdict Card */}
          <div className={clsx(
            'card border-2 p-8',
            isBuy ? 'border-pulse-success/30 bg-pulse-success/5' : 'border-pulse-danger/30 bg-pulse-danger/5'
          )}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-sm font-bold text-pulse-mute dark:text-dark-mute uppercase tracking-widest">FIT-CHECK VERDICT</h1>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className={clsx('text-4xl font-extrabold', isBuy ? 'text-pulse-success' : 'text-pulse-danger')}>
                    {isBuy ? 'BUY ✅' : 'SKIP ❌'}
                  </span>
                  <span className="text-sm text-pulse-mute">Glow Score: {check.glowScore}/100</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-pulse-surface dark:bg-dark-surface px-4 py-3 rounded-lg shadow-sm">
                <span className="text-3xl font-extrabold text-pulse-primary">{check.glowScore}</span>
                <span className="text-xs font-semibold text-pulse-mute leading-none">GLOW<br />SCORE</span>
              </div>
            </div>

            {/* Score Ring indicator */}
            <div className="h-2 bg-pulse-hairline rounded-full overflow-hidden mb-6">
              <div
                className={clsx('h-full', isBuy ? 'bg-pulse-success' : 'bg-pulse-danger')}
                style={{ width: `${check.glowScore}%` }}
              />
            </div>

            <p className="text-pulse-body dark:text-dark-body font-medium leading-relaxed bg-pulse-surface dark:bg-dark-surface p-4 rounded-md border border-pulse-hairline">
              <Sparkles className="w-5 h-5 inline mr-1 text-pulse-primary shrink-0" />
              {check.recommendation}
            </p>
          </div>

          {/* Breakdown Section */}
          <div className="card space-y-6">
            <h3 className="font-bold text-lg">Analysis Breakdown</h3>

            <div className="space-y-4">
              {/* Color Harmony */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-pulse-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Color Harmony</span>
                    <span className="badge bg-purple-50 text-purple-700 text-xs font-semibold">{check.colorScore}/100</span>
                  </div>
                  <p className="text-sm text-pulse-mute mt-1 leading-relaxed">{check.reasons.color}</p>
                </div>
              </div>

              {/* Fabric Safety */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-pulse-success" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Fabric Safety ({check.fabricType})</span>
                    <span className="badge bg-green-50 text-green-700 text-xs font-semibold">{check.fabricScore}/100</span>
                  </div>
                  <p className="text-sm text-pulse-mute mt-1 leading-relaxed">{check.reasons.fabric}</p>
                </div>
              </div>

              {/* Style Fit */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-pulse-info" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Style Fit</span>
                    <span className="badge bg-blue-50 text-blue-700 text-xs font-semibold">{check.styleScore}/100</span>
                  </div>
                  <p className="text-sm text-pulse-mute mt-1 leading-relaxed">{check.reasons.style}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
