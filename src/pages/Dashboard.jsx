import { useState, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { ImagePlus, History, ArrowRight, Loader2, Link2, AlertCircle, Upload, Sparkles, CreditCard } from 'lucide-react'
import useStore from '../store'
import { scrapeProductImage, scrapeProductTitle } from '../services/scraper'

/* Skeleton shimmer */
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-hairline rounded-lg ${className}`} />
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { skinDNA, checks, credits, plan } = useStore()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadMode, setUploadMode] = useState(false)
  const [productImage, setProductImage] = useState(null)
  const fileRef = useRef()

  if (!skinDNA) return <Navigate to="/scan" />

  const recentChecks = checks.slice(0, 6)

  const handleUrlSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    try {
      new URL(url)
      // Demo mode: simulate scraping with realistic delay
      await new Promise(r => setTimeout(r, 1200))
      let imageUrl = '', title = 'Product from ' + new URL(url).hostname

      try {
        const [imgResult, titleResult] = await Promise.all([
          scrapeProductImage(url),
          scrapeProductTitle(url),
        ])
        imageUrl = imgResult?.imageUrl || ''
        title = titleResult || title
      } catch {
        // Demo fallback — generate plausible demo data
        const demoProducts = [
          { title: 'Silk Blouse — Cream White', img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400' },
          { title: 'Cotton T-Shirt — Navy Blue', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
          { title: 'Linen Dress — Sage Green', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
        ]
        const pick = demoProducts[Math.floor(Math.random() * demoProducts.length)]
        title = pick.title
        imageUrl = pick.img
      }

      navigate(`/result/new?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&img=${encodeURIComponent(imageUrl)}`)
    } catch {
      setError('Invalid URL. Try pasting a full product link (e.g. https://shopee.co.id/...)')
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setProductImage(preview)
    navigate(`/result/new?url=upload&title=${encodeURIComponent(file.name)}&img=${encodeURIComponent(preview)}`)
  }

  return (
    <div className="container-marketing py-section-sm sm:py-section">
      {/* Header with credit counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h2 sm:text-h1 text-ink-deep">Check a Product</h1>
          <p className="text-subtitle text-slate mt-1">Paste a link or upload a photo to see if it matches your Skin DNA</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card-base flex items-center gap-2 !py-2 !px-4 !rounded-pill">
            <CreditCard className="w-4 h-4 text-brand-yellow-deep" />
            <span className="text-body-sm-medium text-ink-deep">{credits}</span>
            <span className="text-caption text-stone">credits</span>
          </div>
          {plan === 'free' && (
            <button onClick={() => navigate('/pricing')} className="btn-yellow !py-2 !px-4 text-caption-bold">
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Main Action Card */}
      <div className="card-feature max-w-3xl mx-auto mb-section-sm">
        {/* Tab toggle: URL vs Upload */}
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setUploadMode(false)}
            className={`pill-tab ${!uploadMode ? 'pill-tab-active' : ''}`}>
            <Link2 className="w-4 h-4 inline mr-1" /> Paste URL
          </button>
          <button onClick={() => setUploadMode(true)}
            className={`pill-tab ${uploadMode ? 'pill-tab-active' : ''}`}>
            <Upload className="w-4 h-4 inline mr-1" /> Upload Photo
          </button>
        </div>

        {!uploadMode ? (
          /* URL Mode */
          <form onSubmit={handleUrlSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                <Link2 className="w-5 h-5 text-muted" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="text-input !h-[56px] pl-[48px] pr-[120px] !rounded-xl text-body-md"
                placeholder="https://shopee.co.id/product-name..."
                required
                disabled={loading}
              />
              <div className="absolute inset-y-2 right-2">
                <button type="submit" disabled={loading || !url.trim()}
                  className={`btn-primary h-full px-6 !rounded-lg ${loading ? 'opacity-75' : ''}`}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Check</>}
                </button>
              </div>
            </div>
            <p className="text-caption text-stone mt-3">Supports Shopee, Tokopedia, Zalora, ZARA, H&M, UNIQLO, SHEIN, TikTok Shop, and more</p>
          </form>
        ) : (
          /* Upload Mode */
          <div>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-hairline rounded-xxxl p-section-sm text-center cursor-pointer transition-all duration-200 active:scale-[0.99] active:bg-surface-soft"
            >
              <div className="w-16 h-16 rounded-pill bg-surface-yellow flex items-center justify-center mx-auto mb-4">
                <ImagePlus className="w-8 h-8 text-yellow-dark" />
              </div>
              <p className="text-body-md-medium text-ink-deep">Upload product photo</p>
              <p className="text-body-sm text-slate mt-1">JPG, PNG, or screenshot from any store</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-sm bg-brand-red text-brand-red-dark rounded-lg mt-4 text-body-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Recent Checks */}
      {recentChecks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h4 text-ink-deep flex items-center gap-2">
              <History className="w-5 h-5 text-steel" /> Recent Checks
            </h2>
            <button onClick={() => navigate('/history')} className="btn-link">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentChecks.map((check) => (
              <div key={check.id} onClick={() => navigate(`/result/${check.id}`)}
                className="card-customer-story cursor-pointer group transition-shadow duration-200 active:shadow-card">
                <div className="relative aspect-[4/3] bg-surface overflow-hidden">
                  {check.imageUrl ? (
                    <img src={check.imageUrl} alt={check.title} loading="lazy"
                      className="w-full h-full object-cover group-active:scale-[1.02] transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone">No image</div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={check.verdict === 'BUY' ? 'badge-success' : 'badge-tag-coral'}>
                      {check.verdict === 'BUY' ? 'BUY ✅' : 'SKIP ❌'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="badge-tag-yellow">Glow {check.glowScore}</span>
                  </div>
                </div>
                <div className="p-xl">
                  <h3 className="text-body-sm-medium text-ink-deep line-clamp-2 mb-2">{check.title}</h3>
                  <div className="text-caption text-stone">{new Date(check.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recentChecks.length === 0 && (
        <div className="card-feature text-center border-dashed border-hairline">
          <Sparkles className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
          <h3 className="text-h4 text-ink-deep mb-2">No checks yet</h3>
          <p className="text-body-md text-slate mb-6">Paste a product link above to get your first AI verdict.</p>
        </div>
      )}
    </div>
  )
}
