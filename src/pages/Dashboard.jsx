import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Search, ImagePlus, History, ArrowRight, Loader2, Link2, AlertCircle } from 'lucide-react'
import useStore from '../store'
import { scrapeProductImage, scrapeProductTitle } from '../services/scraper'
import clsx from 'clsx'

export default function Dashboard() {
  const navigate = useNavigate()
  const { skinDNA, checks } = useStore()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Redirect to scan if no DNA
  if (!skinDNA) return <Navigate to="/scan" />

  const recentChecks = checks.slice(0, 3)

  const handleUrlSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    try {
      setLoading(true)
      setError(null)
      // Basic URL validation
      new URL(url)

      // Fetch metadata
      const [imageUrlObj, title] = await Promise.all([
        scrapeProductImage(url),
        scrapeProductTitle(url),
      ])

      const imageUrl = imageUrlObj?.imageUrl

      // We jump straight to Result page with the scraped URL
      // In a real app we'd save to DB and pass ID, here we pass URL params
      navigate(`/result/new?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&img=${encodeURIComponent(imageUrl || '')}`)

    } catch (err) {
      setError('Invalid URL or could not scrape product. Try uploading a photo instead.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Check a Product</h1>
          <p className="text-pulse-mute dark:text-dark-mute mt-1">Paste a link to see if it matches your Skin DNA</p>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="card max-w-3xl mx-auto bg-gradient-to-b from-pulse-surface to-pulse-surface-dark/30 dark:from-dark-surface dark:to-dark-surface/80 p-8 sm:p-12 border-pulse-primary/20 shadow-lg mb-16">
        <form onSubmit={handleUrlSubmit} className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link2 className="w-5 h-5 text-pulse-mute" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field pl-12 pr-32 py-4 text-lg shadow-sm"
            placeholder="Paste link (Shopee, Zara, TikTok Shop...)"
            required
            disabled={loading}
          />
          <div className="absolute inset-y-2 right-2">
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className={clsx('btn-primary h-full px-6', loading && 'opacity-75 cursor-not-allowed')}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check'}
            </button>
          </div>
        </form>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-pulse-danger/10 text-pulse-danger rounded-md mb-6 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 text-sm text-pulse-mute font-medium my-6">
          <div className="h-px bg-pulse-hairline dark:bg-dark-hairline flex-1" />
          OR
          <div className="h-px bg-pulse-hairline dark:bg-dark-hairline flex-1" />
        </div>

        <button
          type="button"
          className="w-full btn-secondary py-4 border-dashed border-pulse-hairline hover:border-pulse-primary hover:bg-pulse-primary/5 text-pulse-ink"
        >
          <ImagePlus className="w-5 h-5 text-pulse-primary" />
          Upload Product Photo
        </button>
        <p className="text-center text-xs text-pulse-mute mt-3">If URL scraping fails, you can upload the product image directly.</p>
      </div>

      {/* Recent Activity */}
      {recentChecks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-pulse-mute" /> Recent Checks
            </h2>
            <button onClick={() => navigate('/history')} className="text-sm font-medium text-pulse-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentChecks.map((check) => (
              <div
                key={check.id}
                onClick={() => navigate(`/result/${check.id}`)}
                className="card p-0 overflow-hidden cursor-pointer group hover:shadow-md transition-all hover:border-pulse-primary/50 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-pulse-surface-dark dark:bg-dark-surface overflow-hidden">
                  {check.imageUrl ? (
                    <img src={check.imageUrl} alt={check.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-pulse-mute">No image</div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={check.verdict === 'BUY' ? 'badge-success shadow-sm' : 'badge-danger shadow-sm'}>
                      {check.verdict === 'BUY' ? 'BUY ✅' : 'SKIP ❌'}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 flex-1">{check.title}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-xs text-pulse-mute">{new Date(check.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs font-bold text-pulse-primary">Glow: {check.glowScore}</div>
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
