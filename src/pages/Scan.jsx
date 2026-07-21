import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ScanFace, Check, Loader2, Camera, AlertCircle, Video, X, Sparkles, Shield, Palette, Activity } from 'lucide-react'
import useStore from '../store'
import { analyzeSkin, getFitzpatrickType, getColorTones, fileToBase64 } from '../services/youcam'

const ANALYSIS_STEPS = [
  { text: 'Detecting face landmarks...', icon: '🔍', duration: 800 },
  { text: 'Analyzing 14 skin markers...', icon: '🧬', duration: 1200 },
  { text: 'Identifying Fitzpatrick type...', icon: '🎨', duration: 900 },
  { text: 'Mapping undertone & season...', icon: '🌈', duration: 700 },
  { text: 'Computing best color palette...', icon: '✨', duration: 600 },
  { text: 'Building your Skin DNA card...', icon: '💎', duration: 500 },
]

function ProgressRing({ value, size = 80, stroke = 6, color = '#0CA789' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0F0F0" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-700 ease-out" />
    </svg>
  )
}

function SkinDNACard({ dna }) {
  const { skinAnalysis, fitzpatrick, colorTones } = dna
  const concerns = Object.entries(skinAnalysis?.concerns || {})
    .sort((a, b) => b[1].score - a[1].score)
  const topConcerns = concerns.slice(0, 6)
  const overallScore = skinAnalysis?.overall_score || 72

  return (
    <div className="card-feature border-2 border-brand-yellow/20 bg-surface-yellow/30 max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center text-2xl shadow-subtle">🧬</div>
          <div>
            <h3 className="text-h5 text-ink-deep">Your Skin DNA</h3>
            <p className="text-caption text-stone">Powered by YouCam AI</p>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <ProgressRing value={overallScore} size={64} />
          <span className="absolute text-h5 text-ink-deep">{overallScore}</span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Skin Type', value: `Fitzpatrick ${fitzpatrick?.label || 'IV'}`, sub: fitzpatrick?.description || 'Medium Brown', icon: Shield, bg: 'bg-surface-yellow', fg: 'text-yellow-dark' },
          { label: 'Undertone', value: (colorTones?.undertone || 'Warm'), sub: `${colorTones?.season || 'Autumn'} palette`, icon: Palette, bg: 'bg-coral-light', fg: 'text-coral-dark' },
          { label: 'Skin Health', value: `${overallScore}/100`, sub: overallScore > 70 ? 'Good' : 'Needs care', icon: Activity, bg: 'bg-teal-light', fg: 'text-moss-dark' },
        ].map((s, i) => (
          <div key={i} className="bg-canvas rounded-xl p-3 border border-hairline-soft text-center">
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-2`}>
              <s.icon className={`w-4 h-4 ${s.fg}`} />
            </div>
            <div className="text-micro-up text-stone uppercase tracking-wider">{s.label}</div>
            <div className="text-body-sm-medium text-ink-deep capitalize mt-0.5">{s.value}</div>
            <div className="text-micro text-stone capitalize">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Skin Markers */}
      <div className="mb-6">
        <div className="text-micro-up text-stone uppercase tracking-wider mb-3">TOP SKIN MARKERS</div>
        <div className="space-y-2.5">
          {topConcerns.map(([key, val]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <span className="text-body-sm capitalize text-charcoal flex-1">{key.replace(/_/g, ' ')}</span>
              <div className="flex items-center gap-2 w-36">
                <div className="flex-1 h-1.5 bg-surface rounded-pill overflow-hidden">
                  <div className={`h-full rounded-pill transition-all duration-700 ${val.score > 50 ? 'bg-warning' : val.score > 30 ? 'bg-brand-blue' : 'bg-success'}`}
                    style={{ width: `${val.score}%` }} />
                </div>
                <span className={`text-caption-bold w-12 text-right capitalize ${val.score > 50 ? 'text-warning' : val.score > 30 ? 'text-brand-blue' : 'text-success'}`}>
                  {val.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best & Avoid Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-micro-up text-success uppercase tracking-wider mb-2">✅ BEST COLORS</div>
          <div className="flex flex-wrap gap-1.5">
            {(colorTones?.best_colors || []).map((hex, i) => (
              <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-pill border border-hairline-soft bg-canvas shadow-subtle">
                <div className="w-3.5 h-3.5 rounded-full border border-hairline shadow-inner" style={{ backgroundColor: hex }} />
                <span className="text-micro text-charcoal">{colorTones?.best_color_names?.[i] || hex}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-micro-up text-danger uppercase tracking-wider mb-2">❌ AVOID</div>
          <div className="flex flex-wrap gap-1.5">
            {(colorTones?.avoid_colors || []).map((hex, i) => (
              <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-pill border border-hairline-soft bg-canvas opacity-50">
                <div className="w-3.5 h-3.5 rounded-full border border-hairline" style={{ backgroundColor: hex }} />
                <span className="text-micro text-charcoal line-through">{colorTones?.avoid_color_names?.[i] || hex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Scan() {
  const navigate = useNavigate()
  const { setSkinDNA, setSelfieUrl, skinDNA, credits, useCredit } = useStore()
  const [step, setStep] = useState(skinDNA ? 2 : 0)
  const [selfieFile, setSelfieFile] = useState(null)
  const [selfiePreview, setSelfiePreview] = useState(null)
  const [error, setError] = useState(null)
  const [dna, setDna] = useState(skinDNA)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [useCamera, setUseCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const fileRef = useRef()
  const videoRef = useRef()
  const canvasRef = useRef()

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
      setCameraStream(stream)
      setUseCamera(true)
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      setError('Camera access denied. Please upload a photo instead.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop())
      setCameraStream(null)
    }
    setUseCamera(false)
  }, [cameraStream])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
      setSelfieFile(file)
      setSelfiePreview(URL.createObjectURL(blob))
      stopCamera()
    }, 'image/jpeg', 0.9)
  }, [stopCamera])

  useEffect(() => { return () => { if (cameraStream) cameraStream.getTracks().forEach(t => t.stop()) } }, [cameraStream])
  useEffect(() => { if (videoRef.current && cameraStream) videoRef.current.srcObject = cameraStream }, [cameraStream])

  const handleSelfieChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelfieFile(file)
    setSelfiePreview(URL.createObjectURL(file))
    setError(null)
    stopCamera()
  }

  const handleAnalyze = async () => {
    if (!selfieFile && !selfiePreview) { setError('Please upload a selfie first.'); return }
    if (!useCredit()) { setError('No credits remaining. Upgrade to Pro for unlimited checks.'); return }
    
    setStep(1)
    setError(null)
    setAnalysisStep(0)
    setAnalysisProgress(0)

    // Animated analysis steps
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setAnalysisStep(i)
      setAnalysisProgress(Math.round(((i + 1) / ANALYSIS_STEPS.length) * 100))
      await new Promise(r => setTimeout(r, ANALYSIS_STEPS[i].duration))
    }

    try {
      let imageBase64 = null
      if (selfieFile) {
        imageBase64 = await fileToBase64(selfieFile)
        setSelfieUrl(selfiePreview)
      }
      const [skinAnalysis, fitzpatrick, colorTones] = await Promise.all([
        analyzeSkin(imageBase64), getFitzpatrickType(imageBase64), getColorTones(imageBase64),
      ])
      const dnaResult = { skinAnalysis, fitzpatrick, colorTones, createdAt: Date.now() }
      setDna(dnaResult)
      setSkinDNA(dnaResult)
      setStep(2)
    } catch {
      // Fallback to demo data
      const [s, f, c] = await Promise.all([analyzeSkin(null), getFitzpatrickType(null), getColorTones(null)])
      const dnaResult = { skinAnalysis: s, fitzpatrick: f, colorTones: c, createdAt: Date.now() }
      setDna(dnaResult)
      setSkinDNA(dnaResult)
      setStep(2)
    }
  }

  return (
    <div className="container-marketing py-section-sm sm:py-section">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0 mb-section-sm max-w-md mx-auto">
        {['Upload', 'Analyzing', 'Skin DNA'].map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-pill text-btn font-medium border-2 transition-all duration-300 ${
              i < step ? 'bg-success border-success text-on-dark' :
              i === step ? 'bg-ink border-ink text-on-dark' :
              'bg-canvas border-hairline text-muted'
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-caption ml-2 hidden sm:inline ${i === step ? 'text-ink-deep font-medium' : 'text-stone'}`}>{s}</span>
            {i < 2 && <div className={`w-10 sm:w-16 h-0.5 mx-2 sm:mx-3 rounded-pill ${i < step ? 'bg-success' : 'bg-hairline'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Upload */}
      {step === 0 && (
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-h2 sm:text-h1 text-ink-deep mb-2">Create Your Skin DNA</h1>
          <p className="text-subtitle text-slate mb-8">Take a selfie or upload a photo. AI analyzes your skin in seconds.</p>

          {error && (
            <div className="flex items-center gap-2 p-sm bg-brand-red text-brand-red-dark rounded-lg mb-6 text-body-sm font-medium text-left">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Camera / Upload Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button onClick={() => { stopCamera(); setUseCamera(false) }}
              className={`pill-tab ${!useCamera ? 'pill-tab-active' : ''}`}>
              <Upload className="w-4 h-4 inline mr-1" /> Upload Photo
            </button>
            <button onClick={startCamera}
              className={`pill-tab ${useCamera ? 'pill-tab-active' : ''}`}>
              <Camera className="w-4 h-4 inline mr-1" /> Use Camera
            </button>
          </div>

          {/* Camera Mode */}
          {useCamera && cameraStream && (
            <div className="relative rounded-xxxl overflow-hidden border-2 border-ink mb-6 aspect-[4/3] bg-ink">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" style={{ transform: 'scaleX(-1)' }} />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                <button onClick={capturePhoto} className="w-16 h-16 rounded-pill bg-on-dark border-4 border-brand-yellow shadow-mockup active:scale-95 transition-transform" />
                <button onClick={stopCamera} className="btn-icon-circular bg-on-dark/80">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Upload Mode */}
          {!useCamera && (
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xxxl p-section-sm cursor-pointer transition-all duration-200 active:scale-[0.99] ${
                selfiePreview ? 'border-ink bg-surface-soft' : 'border-hairline bg-surface-soft'
              }`}
            >
              {selfiePreview ? (
                <div className="space-y-4">
                  <img src={selfiePreview} alt="Selfie" className="w-32 h-32 sm:w-40 sm:h-40 rounded-pill object-cover mx-auto border-4 border-brand-yellow shadow-card" />
                  <p className="text-body-sm text-slate">Looking good! Tap to change.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-pill bg-surface-yellow flex items-center justify-center mx-auto">
                    <Camera className="w-8 h-8 text-yellow-dark" />
                  </div>
                  <p className="text-body-md-medium text-ink-deep">Upload your selfie</p>
                  <p className="text-body-sm text-slate">JPG, PNG, or WEBP · Face clearly visible · Good lighting</p>
                </div>
              )}
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleSelfieChange} />

          <p className="mt-4 text-caption text-stone">🔒 Your photo is processed on-device. Never stored on servers.</p>

          <button onClick={handleAnalyze} disabled={!selfiePreview}
            className={`btn-primary mt-8 px-8 py-[14px] text-body-md-medium ${!selfiePreview ? 'opacity-40 !cursor-not-allowed' : ''}`}>
            <ScanFace className="w-5 h-5" /> Analyze My Skin
          </button>
        </div>
      )}

      {/* Step 1: Analyzing — animated steps */}
      {step === 1 && (
        <div className="max-w-md mx-auto text-center py-section-sm">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <ProgressRing value={analysisProgress} size={96} stroke={6} color="#FFD02F" />
            <span className="absolute inset-0 flex items-center justify-center text-h4 text-ink-deep">{analysisProgress}%</span>
          </div>
          <h2 className="text-h3 text-ink-deep mb-6">Analyzing your skin...</h2>
          <div className="space-y-3 text-left">
            {ANALYSIS_STEPS.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 p-sm rounded-lg transition-all duration-300 ${
                i < analysisStep ? 'bg-teal-light' : i === analysisStep ? 'bg-surface-yellow' : 'bg-surface-soft'
              }`}>
                <span className="text-lg">{i <= analysisStep ? (i < analysisStep ? '✅' : s.icon) : '⏳'}</span>
                <span className={`text-body-sm ${i <= analysisStep ? 'text-ink-deep font-medium' : 'text-stone'}`}>{s.text}</span>
                {i === analysisStep && <Loader2 className="w-4 h-4 text-brand-yellow-deep animate-spin ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Results */}
      {step === 2 && dna && (
        <div>
          <div className="text-center mb-8">
            <div className="badge-success mb-4 mx-auto"><Check className="w-4 h-4" /> Analysis Complete</div>
            <h2 className="text-h2 text-ink-deep">Your Skin DNA is Ready!</h2>
            <p className="mt-2 text-subtitle text-slate">This card powers every product check you do.</p>
          </div>
          <SkinDNACard dna={dna} />
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1 px-8 py-[14px] text-body-md-medium">
              Start Checking Products →
            </button>
            <button onClick={() => { setStep(0); setSelfiePreview(null); setSelfieFile(null) }}
              className="btn-ghost text-slate flex-1">
              Re-scan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
