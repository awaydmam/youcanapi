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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HistoryIcon className="w-8 h-8 text-pulse-primary" /> History
          </h1>
          <p className="text-pulse-mute dark:text-dark-mute mt-1">Manage and view all your past product checks</p>
        </div>
        {checks.length > 0 && (
          <button onClick={handleDeleteAll} className="btn-ghost text-pulse-danger flex items-center gap-1 hover:bg-pulse-danger/10">
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {/* Stats Card */}
      <div className="card bg-gradient-to-br from-pulse-primary to-purple-600 border-none shadow-md p-6 text-white mb-12 flex items-center justify-between">
        <div>
          <div className="text-sm opacity-80 uppercase font-semibold tracking-wider">Total Smart Decisions</div>
          <div className="text-4xl font-extrabold mt-1">{checks.length} checks</div>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-80 uppercase font-semibold tracking-wider">Estimated Money Saved</div>
          <div className="text-4xl font-extrabold mt-1 flex items-center justify-end gap-1">
            <TrendingDown className="w-8 h-8" /> ${moneySaved}
          </div>
        </div>
      </div>

      {checks.length === 0 ? (
        <div className="text-center py-20 card border-dashed">
          <p className="text-lg text-pulse-mute mb-6">No checks history found yet.</p>
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
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-sm line-clamp-2 mb-4">{check.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs text-pulse-mute">{new Date(check.createdAt).toLocaleDateString()}</div>
                  <div className="text-xs font-bold text-pulse-primary">Glow: {check.glowScore}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
