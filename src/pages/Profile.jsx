import { useNavigate } from 'react-router-dom'
import { UserCircle, ScanFace, RefreshCw, Trash2, LogOut, Shield, Palette, Activity } from 'lucide-react'
import useStore from '../store'
import clsx from 'clsx'

function SkinDNAFullCard({ dna }) {
  const { skinAnalysis, fitzpatrick, colorTones } = dna

  const concerns = Object.entries(skinAnalysis?.concerns || {})
    .sort((a, b) => b[1].score - a[1].score)

  return (
    <div className="card border-2 border-pulse-primary/20 bg-gradient-to-br from-purple-50/50 to-blue-50/30 dark:from-purple-900/20 dark:to-dark-surface">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pulse-primary to-purple-400 flex items-center justify-center text-white text-2xl">🧬</div>
        <div>
          <h2 className="font-bold text-xl">Your Skin DNA</h2>
          <p className="text-sm text-pulse-mute">Last updated: {new Date(dna.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Type + Undertone */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Skin Type', value: fitzpatrick?.label || 'Type IV', icon: Shield, color: 'bg-purple-100 text-purple-700' },
          { label: 'Undertone', value: colorTones?.undertone?.charAt(0).toUpperCase() + (colorTones?.undertone?.slice(1) || 'arm'), icon: Palette, color: 'bg-orange-100 text-orange-700' },
          { label: 'Season', value: colorTones?.season?.charAt(0).toUpperCase() + (colorTones?.season?.slice(1) || 'utumn'), icon: Activity, color: 'bg-green-100 text-green-700' },
          { label: 'Overall', value: `${skinAnalysis?.overall_score || 68}/100`, icon: Activity, color: 'bg-blue-100 text-blue-700' },
        ].map((item, i) => (
          <div key={i} className="bg-pulse-surface dark:bg-dark-surface rounded-lg p-4 text-center border border-pulse-hairline">
            <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2', item.color)}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="text-xs text-pulse-mute mb-1">{item.label}</div>
            <div className="font-bold text-sm capitalize">{item.value}</div>
          </div>
        ))}
      </div>

      {/* All Skin Concerns */}
      <div className="mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-pulse-primary" /> All Skin Concerns (14 markers)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {concerns.map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-pulse-surface-dark dark:bg-dark-surface rounded-full overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full transition-all', val.score > 50 ? 'bg-pulse-warning' : val.score > 30 ? 'bg-pulse-info' : 'bg-pulse-success')}
                    style={{ width: `${val.score}%` }}
                  />
                </div>
                <span className={clsx('text-xs font-medium w-16 text-right capitalize', val.score > 50 ? 'text-pulse-warning' : val.score > 30 ? 'text-pulse-info' : 'text-pulse-success')}>
                  {val.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best & Avoid Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-sm mb-3 text-pulse-success flex items-center gap-1">✅ Best Colors for You</h4>
          <div className="flex flex-wrap gap-2">
            {(colorTones?.best_colors || []).map((hex, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pulse-hairline bg-pulse-surface dark:bg-dark-surface shadow-sm">
                <div className="w-4 h-4 rounded-full border border-pulse-hairline shadow-inner" style={{ backgroundColor: hex }} />
                <span className="text-xs font-medium">{colorTones?.best_color_names?.[i] || hex}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-3 text-pulse-danger flex items-center gap-1">❌ Colors to Avoid</h4>
          <div className="flex flex-wrap gap-2">
            {(colorTones?.avoid_colors || []).map((hex, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pulse-hairline bg-pulse-surface dark:bg-dark-surface opacity-60">
                <div className="w-4 h-4 rounded-full border border-pulse-hairline" style={{ backgroundColor: hex }} />
                <span className="text-xs font-medium line-through">{colorTones?.avoid_color_names?.[i] || hex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { skinDNA, resetSkinDNA, checks } = useStore()

  const moneySaved = checks.filter(c => c.verdict === 'SKIP').reduce((sum, c) => sum + (c.estimatedPrice || 25), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pulse-primary to-purple-400 flex items-center justify-center shadow-lg">
          <UserCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-sm text-pulse-mute dark:text-dark-mute">Manage your Skin DNA and account</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Products Checked', value: checks.length },
          { label: 'Money Saved', value: `$${moneySaved}` },
          { label: 'Skin Type', value: skinDNA?.fitzpatrick?.label || 'Not scanned' },
        ].map((stat, i) => (
          <div key={i} className="card text-center">
            <div className="text-2xl font-bold text-pulse-primary dark:text-dark-primary">{stat.value}</div>
            <div className="text-xs text-pulse-mute mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Skin DNA Card */}
      {skinDNA ? (
        <>
          <SkinDNAFullCard dna={skinDNA} />

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/scan')} className="btn-secondary flex-1">
              <RefreshCw className="w-4 h-4" /> Re-scan My Skin
            </button>
            <button
              onClick={() => { resetSkinDNA(); navigate('/scan') }}
              className="btn-ghost text-pulse-danger hover:bg-pulse-danger/10 flex-1"
            >
              <Trash2 className="w-4 h-4" /> Reset Skin DNA
            </button>
          </div>
        </>
      ) : (
        <div className="card text-center py-16 border-dashed">
          <ScanFace className="w-16 h-16 text-pulse-mute mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Skin DNA found</h2>
          <p className="text-pulse-mute mb-6">Create your Skin DNA profile to unlock personalized product checks.</p>
          <button onClick={() => navigate('/scan')} className="btn-primary">
            Create Skin DNA <ScanFace className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
