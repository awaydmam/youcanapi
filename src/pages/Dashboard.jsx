import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { ImagePlus, History, ArrowRight, Loader2, Link2, AlertCircle } from 'lucide-react'
import useStore from '../store'
import { scrapeProductImage, scrapeProductTitle } from '../services/scraper'

export default function Dashboard() {
  const navigate = useNavigate()
  const { skinDNA, checks } = useStore()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!skinDNA) return <Navigate to="/scan" />

  const recentChecks = checks.slice(0, 3)

  const handleUrlSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    try {
      setLoading(true)
      setError(null)
      new URL(url)
      const [imageUrlObj, title] = await Promise.all([
        scrapeProductImage(url),
        scrapeProductTitle(url),
      ])
      const imageUrl = imageUrlObj?.imageUrl
      navigate(`/result/new?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&img=${encodeURIComponent(imageUrl || '')}`)
    } catch {
      setError('Invalid URL or could not scrape product. Try uploading a photo instead.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Check a Product</h1>
        <p className="text-mute mt-1">Paste a link to see if it matches your Skin DNA</p>
      </div>

      {/* Main Action Card — white card, clean Miro style */}
      <div className="card max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl border-2 border-hairline shadow-sm mb-16">
        <form onSubmit={handleUrlSubmit} className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link2 className="w-5 h-5 text-mute" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field pl-12 pr-32 py-4 text-lg rounded-2xl"
            placeholder="Paste link (Shopee, Zara, TikTok Shop...)"
            required
            disabled={loading}
          />
          <div className="absolute inset-y-2 right-2">
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className={`btn-primary h-full px-6 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check'}
            </button>
          </div>
        </form>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-coral-light text-coral-dark rounded-xl mb-6 text-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 text-sm text-mute font-bold my-6">
          <div className="h-px bg-hairline flex-1" />
          OR
          <div className="h-px bg-hairline flex-1" />
        </div>

        <button type="button" className="w-full btn-secondary py-4 !border-dashed !border-hairline hover:!border-ink hover:bg-surface-alt rounded-2xl">
          <ImagePlus className="w-5 h-5 text-brand-blue" />
          Upload Product Photo
        </button>
        <p className="text-center text-xs text-mute mt-3">If URL scraping fails, you can upload the product image directly.</p>
      </div>

      {/* Recent Activity */}
      {recentChecks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
              <History className="w-5 h-5 text-mute" /> Recent Checks
            </h2>
            <button onClick={() => navigate('/history')} className="text-sm font-bold text-brand-blue hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentChecks.map((check) => (
              <div
                key={check.id}
                onClick={() => navigate(`/result/${check.id}`)}
                className="card p-0 overflow-hidden cursor-pointer group hover:shadow-md transition-all hover:border-ink/30 flex flex-col rounded-2xl"
              >
                <div className="relative aspect-[4/3] bg-surface-alt overflow-hidden">
                  {check.imageUrl ? (
                    <img src={check.imageUrl} alt={check.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-mute">No image</div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={check.verdict === 'BUY' ? 'badge-success' : 'badge-danger'}>
                      {check.verdict === 'BUY' ? 'BUY ✅' : 'SKIP ❌'}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-sm line-clamp-2 mb-2 flex-1 text-ink">{check.title}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-xs text-mute">{new Date(check.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs font-extrabold text-brand-blue">Glow: {check.glowScore}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
