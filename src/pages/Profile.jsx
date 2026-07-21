import { useNavigate } from 'react-router-dom'
import { UserCircle, ScanFace, RefreshCw, Trash2, Shield, Palette, Activity } from 'lucide-react'
import useStore from '../store'

function SkinDNAFullCard({ dna }) {
  const { skinAnalysis, fitzpatrick, colorTones } = dna
  const concerns = Object.entries(skinAnalysis?.concerns || {}).sort((a, b) => b[1].score - a[1].score)

  return (
    <div className="card border-2 border-brand-yellow/30 bg-yellow-light/20 rounded-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center text-2xl">🧬</div>
        <div>
          <h2 className="font-extrabold text-xl text-ink">Your Skin DNA</h2>
          <p className="text-sm text-mute">Last updated: {new Date(dna.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Skin Type', value: fitzpatrick?.label || 'Type IV', icon: Shield, bg: 'bg-yellow-light', fg: 'text-yellow-dark' },
          { label: 'Undertone', value: (colorTones?.undertone || 'warm').charAt(0).toUpperCase() + (colorTones?.undertone || 'warm').slice(1), icon: Palette, bg: 'bg-coral-light', fg: 'text-coral-dark' },
          { label: 'Season', value: (colorTones?.season || 'autumn').charAt(0).toUpperCase() + (colorTones?.season || 'autumn').slice(1), icon: Activity, bg: 'bg-teal-light', fg: 'text-moss-dark' },
          { label: 'Overall', value: `${skinAnalysis?.overall_score || 68}/100`, icon: Activity, bg: 'bg-brand-pink', fg: 'text-coral-dark' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 text-center border border-hairline shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${item.bg}`}>
              <item.icon className={`w-5 h-5 ${item.fg}`} />
            </div>
            <div className="text-xs text-mute mb-1">{item.label}</div>
            <div className="font-extrabold text-sm capitalize text-ink">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="font-extrabold mb-4 flex items-center gap-2 text-ink">
          <Activity className="w-5 h-5 text-brand-blue" /> All Skin Concerns (14 markers)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {concerns.map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize text-body">{key.replace(/_/g, ' ')}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${val.score > 50 ? 'bg-warning' : val.score > 30 ? 'bg-brand-blue' : 'bg-success'}`}
                    style={{ width: `${val.score}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-16 text-right capitalize ${val.score > 50 ? 'text-warning' : val.score > 30 ? 'text-brand-blue' : 'text-success'}`}>
                  {val.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="font-extrabold text-sm mb-3 text-success flex items-center gap-1">✅ Best Colors for You</h4>
          <div className="flex flex-wrap gap-2">
            {(colorTones?.best_colors || []).map((hex, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill border border-hairline bg-white shadow-sm">
                <div className="w-4 h-4 rounded-full border border-hairline shadow-inner" style={{ backgroundColor: hex }} />
                <span className="text-xs font-medium">{colorTones?.best_color_names?.[i] || hex}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-extrabold text-sm mb-3 text-danger flex items-center gap-1">❌ Colors to Avoid</h4>
          <div className="flex flex-wrap gap-2">
            {(colorTones?.avoid_colors || []).map((hex, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill border border-hairline bg-white opacity-60">
                <div className="w-4 h-4 rounded-full border border-hairline" style={{ backgroundColor: hex }} />
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
      <div className="flex items-center gap-3 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center shadow-lg">
          <UserCircle className="w-8 h-8 text-brand-yellow" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-ink">My Profile</h1>
          <p className="text-sm text-mute">Manage your Skin DNA and account</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Products Checked', value: checks.length, color: 'text-brand-blue' },
          { label: 'Money Saved', value: `$${moneySaved}`, color: 'text-success' },
          { label: 'Skin Type', value: skinDNA?.fitzpatrick?.label || 'Not scanned', color: 'text-brand-yellow-deep' },
        ].map((stat, i) => (
          <div key={i} className="card text-center rounded-2xl">
            <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-mute mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {skinDNA ? (
        <>
          <SkinDNAFullCard dna={skinDNA} />
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/scan')} className="btn-secondary flex-1 rounded-2xl">
              <RefreshCw className="w-4 h-4" /> Re-scan My Skin
            </button>
            <button
              onClick={() => { resetSkinDNA(); navigate('/scan') }}
              className="btn-ghost text-danger hover:bg-coral-light flex-1 rounded-2xl"
            >
              <Trash2 className="w-4 h-4" /> Reset Skin DNA
            </button>
          </div>
        </>
      ) : (
        <div className="card text-center py-16 border-dashed rounded-3xl">
          <ScanFace className="w-16 h-16 text-mute mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-ink mb-2">No Skin DNA found</h2>
          <p className="text-mute mb-6">Create your Skin DNA profile to unlock personalized product checks.</p>
          <button onClick={() => navigate('/scan')} className="btn-primary">
            Create Skin DNA <ScanFace className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
