import { useNavigate } from 'react-router-dom'
import { History as HistoryIcon, TrendingDown, ArrowRight, Trash2 } from 'lucide-react'
import useStore from '../store'

export default function History() {
  const navigate = useNavigate()
  const { checks, moneySaved } = useStore()

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to clear your check history?')) {
      useStore.setState({ checks: [] })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-ink flex items-center gap-2">
            <HistoryIcon className="w-8 h-8 text-brand-yellow-deep" /> History
          </h1>
          <p className="text-mute mt-1">Manage and view all your past product checks</p>
        </div>
        {checks.length > 0 && (
          <button onClick={handleDeleteAll} className="btn-ghost text-danger flex items-center gap-1 hover:bg-coral-light rounded-xl px-4 py-2">
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {/* Stats Card — Miro-inspired dark branding pill */}
      <div className="card bg-ink text-white p-8 rounded-3xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs opacity-60 uppercase font-extrabold tracking-widest">Total Smart Decisions</div>
          <div className="text-4xl font-extrabold mt-2 text-brand-yellow">{checks.length} checks</div>
        </div>
        <div className="text-right sm:text-right text-center">
          <div className="text-xs opacity-60 uppercase font-extrabold tracking-widest">Estimated Money Saved</div>
          <div className="text-4xl font-extrabold mt-2 flex items-center justify-end gap-2 text-brand-teal">
            <TrendingDown className="w-8 h-8" /> ${moneySaved}
          </div>
        </div>
      </div>

      {checks.length === 0 ? (
        <div className="text-center py-20 card rounded-3xl border-dashed">
          <p className="text-lg text-mute mb-6 font-medium">No check history found yet.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Check Your First Product <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {checks.map((check) => (
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
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-sm line-clamp-2 mb-4 text-ink">{check.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs text-mute">{new Date(check.createdAt).toLocaleDateString()}</div>
                  <div className="text-xs font-extrabold text-brand-blue">Glow: {check.glowScore}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
