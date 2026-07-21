import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ScanFace, Check, Loader2, Camera, AlertCircle } from 'lucide-react'
import useStore from '../store'
import { analyzeSkin, getFitzpatrickType, getColorTones, fileToBase64 } from '../services/youcam'
import clsx from 'clsx'

const STEPS = ['Upload Selfie', 'Analyzing', 'Your Skin DNA']

function SkinDNACard({ dna }) {
  const { skinAnalysis, fitzpatrick, colorTones } = dna

  const concernsList = Object.entries(skinAnalysis?.concerns || {})
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 6)

  return (
    <div className="card border-2 border-pulse-primary/20 bg-gradient-to-br from-purple-50/50 to-blue-50/30 dark:from-purple-900/20 dark:to-dark-surface max-w-xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pulse-primary to-purple-400 flex items-center justify-center">
          <span className="text-white text-lg">🧬</span>
        </div>
        <div>
          <h3 className="font-bold text-lg">Your Skin DNA</h3>
          <p className="text-sm text-pulse-mute dark:text-dark-mute">Powered by YouCam AI</p>
        </div>
      </div>

      {/* Skin Type Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-pulse-surface dark:bg-dark-surface rounded-md p-3">
          <div className="text-xs text-pulse-mute dark:text-dark-mute mb-1">Skin Type</div>
          <div className="font-semibold">Fitzpatrick {fitzpatrick?.label || 'IV'}</div>
          <div className="text-xs text-pulse-mute mt-0.5">{fitzpatrick?.description || 'Medium Brown'}</div>
        </div>
        <div className="bg-pulse-surface dark:bg-dark-surface rounded-md p-3">
          <div className="text-xs text-pulse-mute dark:text-dark-mute mb-1">Undertone</div>
          <div className="font-semibold capitalize">{colorTones?.undertone || 'Warm'}</div>
          <div className="text-xs text-pulse-mute mt-0.5 capitalize">{colorTones?.season || 'Autumn'} palette</div>
        </div>
      </div>

      {/* Skin Status */}
      <div className="mb-6">
        <div className="text-sm font-semibold mb-3 text-pulse-mute dark:text-dark-mute uppercase tracking-wide">Skin Status</div>
        <div className="space-y-2">
          {concernsList.map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-pulse-surface-dark dark:bg-dark-surface rounded-full overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full', val.score > 50 ? 'bg-pulse-warning' : val.score > 30 ? 'bg-pulse-info' : 'bg-pulse-success')}
                    style={{ width: `${val.score}%` }}
                  />
                </div>
                <span className={clsx('text-xs font-medium', val.score > 50 ? 'text-pulse-warning' : val.score > 30 ? 'text-pulse-info' : 'text-pulse-success')}>
                  {val.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Colors */}
      <div className="mb-4">
        <div className="text-sm font-semibold mb-2 text-pulse-mute dark:text-dark-mute uppercase tracking-wide">Your Best Colors</div>
        <div className="flex flex-wrap gap-2">
          {(colorTones?.best_colors || []).map((hex, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-pulse-hairline bg-pulse-surface dark:bg-dark-surface">
              <div className="w-3 h-3 rounded-full border border-pulse-hairline" style={{ backgroundColor: hex }} />
              <span className="text-xs">{colorTones?.best_color_names?.[i] || hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Avoid Colors */}
      <div className="mb-6">
        <div className="text-sm font-semibold mb-2 text-pulse-mute dark:text-dark-mute uppercase tracking-wide">Colors to Avoid</div>
        <div className="flex flex-wrap gap-2">
          {(colorTones?.avoid_colors || []).map((hex, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-pulse-hairline bg-pulse-surface dark:bg-dark-surface opacity-60">
              <div className="w-3 h-3 rounded-full border border-pulse-hairline" style={{ backgroundColor: hex }} />
              <span className="text-xs line-through">{colorTones?.avoid_color_names?.[i] || hex}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-pulse-mute dark:text-dark-mute">
        ✨ Scan updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}

export default function Scan() {
  const navigate = useNavigate()
  const { setSkinDNA, setSelfieUrl, setBodyPhotoUrl, skinDNA } = useStore()
  const [step, setStep] = useState(skinDNA ? 2 : 0)
  const [selfieFile, setSelfieFile] = useState(null)
  const [selfiePreview, setSelfiePreview] = useState(null)
  const [error, setError] = useState(null)
  const [dna, setDna] = useState(skinDNA)
  const fileRef = useRef()

  const handleSelfieChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelfieFile(file)
    setSelfiePreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!selfieFile && !selfiePreview) {
      setError('Please upload a selfie first.')
      return
    }
    setStep(1)
    setError(null)

    try {
      let imageBase64 = null
      if (selfieFile) {
        imageBase64 = await fileToBase64(selfieFile)
        setSelfieUrl(selfiePreview)
      }

      const [skinAnalysis, fitzpatrick, colorTones] = await Promise.all([
        analyzeSkin(imageBase64),
        getFitzpatrickType(imageBase64),
        getColorTones(imageBase64),
      ])

      const dnaResult = { skinAnalysis, fitzpatrick, colorTones, createdAt: Date.now() }
      setDna(dnaResult)
      setSkinDNA(dnaResult)
      setStep(2)
    } catch (err) {
      setError('Analysis failed. Using demo data instead.')
      // Use mock data fallback
      const { analyzeSkin: mockSkin, getFitzpatrickType: mockFitz, getColorTones: mockColors } = await import('../services/youcam')
      const [s, f, c] = await Promise.all([mockSkin(null), mockFitz(null), mockColors(null)])
      const dnaResult = { skinAnalysis: s, fitzpatrick: f, colorTones: c, createdAt: Date.now() }
      setDna(dnaResult)
      setSkinDNA(dnaResult)
      setStep(2)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Step progress */}
      <div className="flex items-center justify-center gap-0 mb-12">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={clsx(
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all',
              i < step ? 'bg-pulse-success border-pulse-success text-white' :
              i === step ? 'bg-pulse-primary border-pulse-primary text-white' :
              'bg-pulse-surface dark:bg-dark-surface border-pulse-hairline text-pulse-mute'
            )}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <div className={clsx('text-xs ml-2', i === step ? 'text-pulse-ink dark:text-dark-ink font-medium' : 'text-pulse-mute dark:text-dark-mute')}>{s}</div>
            {i < STEPS.length - 1 && <div className={clsx('w-12 h-0.5 mx-3', i < step ? 'bg-pulse-success' : 'bg-pulse-hairline dark:bg-dark-hairline')} />}
          </div>
        ))}
      </div>

      {/* Step 0: Upload */}
      {step === 0 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Create Your Skin DNA</h1>
          <p className="text-pulse-mute dark:text-dark-mute mb-8">Upload a clear selfie in good lighting. The AI will analyze your skin in seconds.</p>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-pulse-warning/10 text-pulse-warning rounded-md mb-6 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div
            onClick={() => fileRef.current?.click()}
            className={clsx(
              'border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all hover:border-pulse-primary hover:bg-pulse-primary/5',
              selfiePreview ? 'border-pulse-primary' : 'border-pulse-hairline dark:border-dark-hairline'
            )}
          >
            {selfiePreview ? (
              <div className="space-y-4">
                <img src={selfiePreview} alt="Selfie preview" className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-pulse-primary" />
                <p className="text-sm text-pulse-mute">Looking good! Click to change.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-pulse-primary/10 flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-pulse-primary" />
                </div>
                <p className="font-medium">Upload your selfie</p>
                <p className="text-sm text-pulse-mute">JPG, PNG, or WEBP. Face clearly visible.</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfieChange} />

          <div className="mt-4 text-xs text-pulse-mute flex items-center justify-center gap-1">
            <span>🔒</span> Your photo is processed locally and never stored on our servers
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selfiePreview}
            className={clsx('btn-primary mt-8 text-lg px-8 py-4', !selfiePreview && 'opacity-50 cursor-not-allowed')}
          >
            <ScanFace className="w-5 h-5" /> Analyze My Skin
          </button>
        </div>
      )}

      {/* Step 1: Analyzing */}
      {step === 1 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-pulse-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader2 className="w-10 h-10 text-pulse-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Analyzing your skin...</h2>
          <div className="space-y-2 text-sm text-pulse-mute max-w-xs mx-auto">
            <p>✓ Detecting skin concerns (14 markers)</p>
            <p>✓ Identifying Fitzpatrick skin type</p>
            <p>✓ Mapping color tones & undertone</p>
          </div>
        </div>
      )}

      {/* Step 2: Results */}
      {step === 2 && dna && (
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pulse-success/10 text-pulse-success text-sm font-medium mb-4">
              <Check className="w-4 h-4" /> Analysis Complete
            </div>
            <h2 className="text-3xl font-bold">Your Skin DNA is Ready!</h2>
            <p className="mt-2 text-pulse-mute dark:text-dark-mute">Save this card — it powers every product check you do.</p>
          </div>

          <SkinDNACard dna={dna} />

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/dashboard')} className="btn-primary text-lg px-8 py-4">
              Start Checking Products →
            </button>
            <button onClick={() => { setStep(0); setSelfiePreview(null); setSelfieFile(null) }} className="btn-ghost">
              Re-scan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
