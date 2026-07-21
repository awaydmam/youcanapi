import { useNavigate } from 'react-router-dom'
import { History as HistoryIcon, TrendingDown, ArrowRight, Trash2, BarChart3, ShoppingBag, Target, Sparkles } from 'lucide-react'
import useStore from '../store'

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card-base text-center">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
        <Icon className="w-5 h-5 text-on-dark" />
      </div>
      <div className="text-h3 text-ink-deep">{value}</div>
      <div className="text-caption text-stone mt-1">{label}</div>
      {sub && <div className="text-micro text-slate mt-0.5">{sub}</div>}
    </div>
  )
}

export default function History() {
  const navigate = useNavigate()
  const { checks, clearChecks, formatPrice } = useStore()
  const moneySaved = checks.filter(c => c.verdict === 'SKIP').reduce((sum, c) => sum + (c.estimatedPrice || 25), 0)
  const buyCount = checks.filter(c => c.verdict === 'BUY').length
  const skipCount = checks.filter(c => c.verdict === 'SKIP').length
  const avgGlow = checks.length ? Math.round(checks.reduce((s, c) => s + (c.glowScore || 0), 0) / checks.length) : 0

  return (
    <div className="container-marketing py-section-sm sm:py-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h2 sm:text-h1 text-ink-deep flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-brand-yellow-deep" /> History
          </h1>
          <p className="text-subtitle text-slate mt-1">Your product check history and savings</p>
        </div>
        {checks.length > 0 && (
          <button onClick={() => { if (confirm('Clear all history?')) clearChecks() }}
            className="btn-ghost text-danger">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      {/* Stats Row */}
      {checks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-section-sm">
          <StatCard label="Total Checks" value={checks.length} icon={ShoppingBag} color="bg-brand-blue" />
          <StatCard label="Money Saved" value={formatPrice(moneySaved)} icon={TrendingDown} color="bg-success" sub={`${skipCount} skipped`} />
          <StatCard label="Buy Rate" value={`${checks.length ? Math.round((buyCount / checks.length) * 100) : 0}%`} icon={Target} color="bg-brand-yellow-deep" sub={`${buyCount} approved`} />
          <StatCard label="Avg Glow Score" value={avgGlow} icon={BarChart3} color="bg-brand-coral" />
        </div>
      )}

      {/* Check Grid */}
      {checks.length === 0 ? (
        <div className="card-feature text-center border-dashed border-hairline py-section">
          <Sparkles className="w-14 h-14 text-brand-yellow mx-auto mb-4" />
          <h3 className="text-h4 text-ink-deep mb-2">No checks yet</h3>
          <p className="text-body-md text-slate mb-6">Start checking products to build your history.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary px-8 py-[14px]">
            Check Your First Product <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {checks.map((check) => (
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
                <div className="flex items-center justify-between">
                  <span className="text-caption text-stone">{new Date(check.createdAt).toLocaleDateString()}</span>
                  {check.estimatedPrice && (
                    <span className="text-caption-bold text-charcoal">{formatPrice(check.estimatedPrice)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
