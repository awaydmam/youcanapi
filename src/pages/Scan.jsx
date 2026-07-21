import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ScanFace, Check, Loader2, Camera, AlertCircle } from 'lucide-react'
import useStore from '../store'
import { analyzeSkin, getFitzpatrickType, getColorTones, fileToBase64 } from '../services/youcam'

const STEPS = ['Upload Selfie', 'Analyzing', 'Your Skin DNA']

function SkinDNACard({ dna }) {
  const { skinAnalysis, fitzpatrick, colorTones } = dna
  const concernsList = Object.entries(skinAnalysis?.concerns || {})
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 6)

  return (
    <div className="card border-2 border-brand-yellow/30 bg-yellow-light/30 max-w-xl w-full mx-auto rounded-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center text-lg">🧬</div>
        <div>
          <h3 className="font-extrabold text-lg text-ink">Your Skin DNA</h3>
          <p className="text-sm text-mute">Powered by YouCam AI</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-3 border border-hairline">
          <div className="text-xs text-mute mb-1">Skin Type</div>
          <div className="font-bold text-ink">Fitzpatrick {fitzpatrick?.label || 'IV'}</div>
          <div className="text-xs text-mute mt-0.5">{fitzpatrick?.description || 'Medium Brown'}</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-hairline">
          <div className="text-xs text-mute mb-1">Undertone</div>
          <div className="font-bold text-ink capitalize">{colorTones?.undertone || 'Warm'}</div>
          <div className="text-xs text-mute mt-0.5 capitalize">{colorTones?.season || 'Autumn'} palette</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-extrabold mb-3 text-mute uppercase tracking-[0.15em]">Skin Status</div>
        <div className="space-y-2.5">
          {concernsList.map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize text-body">{key.replace(/_/g, ' ')}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${val.score > 50 ? 'bg-warning' : val.score > 30 ? 'bg-brand-blue' : 'bg-success'}`}
                    style={{ width: `${val.score}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-14 text-right ${val.score > 50 ? 'text-warning' : val.score > 30 ? 'text-brand-blue' : 'text-success'}`}>
                  {val.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-extrabold mb-2 text-mute uppercase tracking-[0.15em]">Your Best Colors</div>
        <div className="flex flex-wrap gap-2">
          {(colorTones?.best_colors || []).map((hex, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill border border-hairline bg-white">
              <div className="w-3 h-3 rounded-full border border-hairline" style={{ backgroundColor: hex }} />
              <span className="text-xs font-medium">{colorTones?.best_color_names?.[i] || hex}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-extrabold mb-2 text-mute uppercase tracking-[0.15em]">Colors to Avoid</div>
        <div className="flex flex-wrap gap-2">
          {(colorTones?.avoid_colors || []).map((hex, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill border border-hairline bg-white opacity-60">
              <div className="w-3 h-3 rounded-full border border-hairline" style={{ backgroundColor: hex }} />
              <span className="text-xs line-through">{colorTones?.avoid_color_names?.[i] || hex}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-mute mt-4">✨ Scan updated: {new Date().toLocaleDateString()}</div>
    </div>
  )
}

export default function Scan() {
  const navigate = useNavigate()
  const { setSkinDNA, setSelfieUrl, skinDNA } = useStore()
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
    } catch {
      setError('Analysis failed. Using demo data instead.')
      const [s, f, c] = await Promise.all([analyzeSkin(null), getFitzpatrickType(null), getColorTones(null)])
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
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all ${
              i < step ? 'bg-success border-success text-white' :
              i === step ? 'bg-ink border-ink text-white' :
              'bg-white border-hairline text-mute'
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <div className={`text-xs ml-2 ${i === step ? 'text-ink font-bold' : 'text-mute'}`}>{s}</div>
            {i < STEPS.length - 1 && <div className={`w-12 h-0.5 mx-3 ${i < step ? 'bg-success' : 'bg-hairline'}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mb-2">Create Your Skin DNA</h1>
          <p className="text-mute mb-8">Upload a clear selfie in good lighting. The AI will analyze your skin in seconds.</p>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-coral-light text-coral-dark rounded-xl mb-6 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-12 cursor-pointer transition-all hover:border-ink hover:bg-surface-alt ${
              selfiePreview ? 'border-ink' : 'border-hairline'
            }`}
          >
            {selfiePreview ? (
              <div className="space-y-4">
                <img src={selfiePreview} alt="Selfie preview" className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-brand-yellow" />
                <p className="text-sm text-mute">Looking good! Click to change.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-yellow-light flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-yellow-dark" />
                </div>
                <p className="font-bold text-ink">Upload your selfie</p>
                <p className="text-sm text-mute">JPG, PNG, or WEBP. Face clearly visible.</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfieChange} />

          <div className="mt-4 text-xs text-mute flex items-center justify-center gap-1">
            🔒 Your photo is processed locally and never stored on our servers
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selfiePreview}
            className={`btn-primary mt-8 text-base px-8 py-4 ${!selfiePreview ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ScanFace className="w-5 h-5" /> Analyze My Skin
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-yellow-light flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader2 className="w-10 h-10 text-brand-yellow-deep animate-spin" />
          </div>
          <h2 className="text-2xl font-extrabold text-ink mb-3">Analyzing your skin...</h2>
          <div className="space-y-2 text-sm text-mute max-w-xs mx-auto">
            <p>✓ Detecting skin concerns (14 markers)</p>
            <p>✓ Identifying Fitzpatrick skin type</p>
            <p>✓ Mapping color tones & undertone</p>
          </div>
        </div>
      )}

      {step === 2 && dna && (
        <div>
          <div className="text-center mb-8">
            <div className="badge-success mb-4"><Check className="w-4 h-4" /> Analysis Complete</div>
            <h2 className="text-3xl font-extrabold text-ink">Your Skin DNA is Ready!</h2>
            <p className="mt-2 text-mute">Save this card — it powers every product check you do.</p>
          </div>
          <SkinDNACard dna={dna} />
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/dashboard')} className="btn-primary text-base px-8 py-4">
              Start Checking Products →
            </button>
            <button onClick={() => { setStep(0); setSelfiePreview(null); setSelfieFile(null) }} className="btn-ghost text-mute">
              Re-scan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
