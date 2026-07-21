import { useNavigate } from 'react-router-dom'
import { UserCircle, ScanFace, RefreshCw, Trash2, Shield, Palette, Activity, CreditCard, Crown, ArrowRight, Droplets, Sun, Thermometer } from 'lucide-react'
import useStore from '../store'

function ProgressRing({ value, size = 72, stroke = 5, color }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  const c = color || (value >= 70 ? '#0CA789' : value >= 40 ? '#F5A623' : '#E5484D')
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0F0F0" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-700 ease-out" />
    </svg>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { skinDNA, resetSkinDNA, checks, credits, plan, formatPrice, totalCreditsUsed } = useStore()
  const moneySaved = checks.filter(c => c.verdict === 'SKIP').reduce((sum, c) => sum + (c.estimatedPrice || 25), 0)
  const buyCount = checks.filter(c => c.verdict === 'BUY').length
  const avgGlow = checks.length ? Math.round(checks.reduce((s, c) => s + (c.glowScore || 0), 0) / checks.length) : 0
  const concerns = skinDNA ? Object.entries(skinDNA.skinAnalysis?.concerns || {}).sort((a, b) => b[1].score - a[1].score) : []
  const overallScore = skinDNA?.skinAnalysis?.overall_score || 72

  return (
    <div className="container-marketing py-section-sm sm:py-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xxl bg-ink flex items-center justify-center shadow-card">
            <UserCircle className="w-9 h-9 text-brand-yellow" />
          </div>
          <div>
            <h1 className="text-h2 text-ink-deep">My Profile</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge-tag text-micro ${plan === 'pro' ? 'bg-brand-yellow text-ink' : plan === 'enterprise' ? 'bg-ink text-on-dark' : 'bg-surface text-slate'}`}>
                {plan === 'enterprise' ? '👑 Enterprise' : plan === 'pro' ? '⭐ Pro' : '🆓 Free Plan'}
              </span>
              <span className="text-caption text-stone">{credits} credits remaining</span>
            </div>
          </div>
        </div>
        {plan === 'free' && (
          <button onClick={() => navigate('/pricing')} className="btn-yellow">
            <Crown className="w-4 h-4" /> Upgrade Plan
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Products Checked', value: checks.length, color: 'text-brand-blue', bg: 'bg-surface-pricing' },
          { label: 'Money Saved', value: formatPrice(moneySaved), color: 'text-success', bg: 'bg-teal-light' },
          { label: 'Credits Used', value: totalCreditsUsed, color: 'text-brand-yellow-deep', bg: 'bg-surface-yellow' },
          { label: 'Avg Glow Score', value: avgGlow || '—', color: 'text-brand-coral', bg: 'bg-coral-light' },
        ].map((stat, i) => (
          <div key={i} className={`card-base text-center ${stat.bg} !border-0`}>
            <div className={`text-h3 ${stat.color}`}>{stat.value}</div>
            <div className="text-caption text-stone mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {skinDNA ? (
        <>
          {/* Full Skin DNA Panel */}
          <div className="card-feature border-2 border-brand-yellow/20 bg-surface-yellow/20 mb-6">
            {/* DNA Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center text-2xl shadow-subtle">🧬</div>
                <div>
                  <h2 className="text-h4 text-ink-deep">Your Skin DNA</h2>
                  <p className="text-caption text-stone">Last updated: {new Date(skinDNA.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="relative">
                <ProgressRing value={overallScore} size={64} />
                <span className="absolute inset-0 flex items-center justify-center text-h5 text-ink-deep">{overallScore}</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Skin Type', value: `Fitzpatrick ${skinDNA.fitzpatrick?.label || 'IV'}`, sub: skinDNA.fitzpatrick?.description || 'Medium Brown', icon: Shield, bg: 'bg-surface-yellow', fg: 'text-yellow-dark' },
                { label: 'Undertone', value: skinDNA.colorTones?.undertone || 'Warm', sub: 'Dermatologist-verified', icon: Palette, bg: 'bg-coral-light', fg: 'text-coral-dark' },
                { label: 'Season', value: skinDNA.colorTones?.season || 'Autumn', sub: 'Color palette match', icon: Sun, bg: 'bg-teal-light', fg: 'text-moss-dark' },
                { label: 'Sensitivity', value: overallScore > 60 ? 'Normal' : 'Sensitive', sub: overallScore > 60 ? 'Low reactivity' : 'High reactivity', icon: Thermometer, bg: 'bg-brand-pink', fg: 'text-coral-dark' },
              ].map((s, i) => (
                <div key={i} className="bg-canvas rounded-xl p-md border border-hairline-soft text-center">
                  <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                    <s.icon className={`w-4 h-4 ${s.fg}`} />
                  </div>
                  <div className="text-micro-up text-stone uppercase tracking-wider">{s.label}</div>
                  <div className="text-body-sm-medium text-ink-deep capitalize mt-0.5">{s.value}</div>
                  <div className="text-micro text-stone capitalize">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* All 14 Skin Concerns */}
            <div className="mb-8">
              <h3 className="text-h5 text-ink-deep mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-blue" /> All Skin Concerns (14 markers)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {concerns.map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <span className="text-body-sm capitalize text-charcoal flex-1">{key.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2 w-32">
                      <div className="flex-1 h-2 bg-surface rounded-pill overflow-hidden">
                        <div className={`h-full rounded-pill transition-all duration-700 ${val.score > 50 ? 'bg-warning' : val.score > 30 ? 'bg-brand-blue' : 'bg-success'}`}
                          style={{ width: `${val.score}%` }} />
                      </div>
                      <span className={`text-caption-bold w-14 text-right capitalize ${val.score > 50 ? 'text-warning' : val.score > 30 ? 'text-brand-blue' : 'text-success'}`}>
                        {val.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-body-sm-medium text-success flex items-center gap-1 mb-3">✅ Best Colors for You</h4>
                <div className="flex flex-wrap gap-2">
                  {(skinDNA.colorTones?.best_colors || []).map((hex, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-sm py-xxs rounded-pill border border-hairline-soft bg-canvas shadow-subtle">
                      <div className="w-4 h-4 rounded-pill border border-hairline shadow-inner" style={{ backgroundColor: hex }} />
                      <span className="text-micro text-charcoal">{skinDNA.colorTones?.best_color_names?.[i] || hex}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-body-sm-medium text-danger flex items-center gap-1 mb-3">❌ Colors to Avoid</h4>
                <div className="flex flex-wrap gap-2">
                  {(skinDNA.colorTones?.avoid_colors || []).map((hex, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-sm py-xxs rounded-pill border border-hairline-soft bg-canvas opacity-50">
                      <div className="w-4 h-4 rounded-pill border border-hairline" style={{ backgroundColor: hex }} />
                      <span className="text-micro text-charcoal line-through">{skinDNA.colorTones?.avoid_color_names?.[i] || hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skin care tips based on DNA */}
            <div className="bg-canvas rounded-xl p-xl border border-hairline-soft">
              <h4 className="text-body-sm-medium text-ink-deep mb-3 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-brand-blue" /> Personalized Tips
              </h4>
              <ul className="space-y-2 text-body-sm text-charcoal">
                <li>• Your {skinDNA.colorTones?.undertone || 'warm'} undertone pairs best with earthy, warm-toned apparel</li>
                <li>• As a Fitzpatrick {skinDNA.fitzpatrick?.label || 'IV'}, choose fabrics with UV protection for outdoor wear</li>
                <li>• Your {skinDNA.colorTones?.season || 'autumn'} palette means rich jewel tones complement your complexion</li>
                <li>• Avoid high-contrast cool pastels that can wash out your natural warmth</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/scan')} className="btn-secondary flex-1">
              <RefreshCw className="w-4 h-4" /> Re-scan My Skin
            </button>
            <button onClick={() => { if (confirm('Reset your Skin DNA? You\'ll need to scan again.')) { resetSkinDNA(); navigate('/scan') } }}
              className="btn-ghost text-danger flex-1">
              <Trash2 className="w-4 h-4" /> Reset Skin DNA
            </button>
          </div>
        </>
      ) : (
        /* No Skin DNA state */
        <div className="card-feature text-center border-dashed border-hairline py-section">
          <ScanFace className="w-16 h-16 text-brand-yellow mx-auto mb-4" />
          <h2 className="text-h3 text-ink-deep mb-2">No Skin DNA found</h2>
          <p className="text-body-md text-slate mb-6 max-w-md mx-auto">
            Create your Skin DNA profile to unlock personalized product checks, color matching, and smart shopping recommendations.
          </p>
          <button onClick={() => navigate('/scan')} className="btn-primary px-8 py-[14px] text-body-md-medium">
            Create Skin DNA <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
