import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Device fingerprint for guest credit tracking
const getDeviceId = () => {
  let id = localStorage.getItem('fc_device_id')
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('fc_device_id', id)
  }
  return id
}

const useStore = create(
  persist(
    (set, get) => ({
      // === AUTH / CREDITS ===
      deviceId: getDeviceId(),
      plan: 'free', // free | pro | enterprise
      credits: 10,  // guest starts with 10
      totalCreditsUsed: 0,
      useCredit: () => {
        const s = get()
        if (s.credits <= 0 && s.plan === 'free') return false
        set({ credits: Math.max(0, s.credits - 1), totalCreditsUsed: s.totalCreditsUsed + 1 })
        return true
      },
      addCredits: (n) => set((s) => ({ credits: s.credits + n })),
      setPlan: (plan) => {
        const creditMap = { free: 10, pro: 500, enterprise: 99999 }
        set({ plan, credits: creditMap[plan] || 10 })
      },

      // === CURRENCY ===
      currency: 'USD',
      exchangeRate: 1,
      setCurrency: (currency, rate) => set({ currency, exchangeRate: rate }),
      formatPrice: (usdAmount) => {
        const s = get()
        const converted = usdAmount * s.exchangeRate
        if (s.currency === 'IDR') return `Rp ${Math.round(converted).toLocaleString('id-ID')}`
        if (s.currency === 'EUR') return `€${converted.toFixed(2)}`
        return `$${converted.toFixed(2)}`
      },

      // === SKIN DNA ===
      skinDNA: null,
      selfieUrl: null,
      bodyPhotoUrl: null,
      setSkinDNA: (dna) => set({ skinDNA: dna }),
      setSelfieUrl: (url) => set({ selfieUrl: url }),
      setBodyPhotoUrl: (url) => set({ bodyPhotoUrl: url }),
      resetSkinDNA: () => set({ skinDNA: null, selfieUrl: null, bodyPhotoUrl: null }),

      // === PRODUCT CHECKS ===
      checks: [],
      addCheck: (check) => set((s) => ({ checks: [check, ...s.checks] })),
      getCheck: (id) => get().checks.find((c) => c.id === id),
      clearChecks: () => set({ checks: [] }),

      // === COMPUTED ===
      get totalChecks() { return get().checks.length },
      get moneySaved() {
        return get().checks
          .filter((c) => c.verdict === 'SKIP')
          .reduce((sum, c) => sum + (c.estimatedPrice || 25), 0)
      },
      get buyRate() {
        const checks = get().checks
        if (!checks.length) return 0
        return Math.round((checks.filter(c => c.verdict === 'BUY').length / checks.length) * 100)
      },
      get avgGlowScore() {
        const checks = get().checks
        if (!checks.length) return 0
        return Math.round(checks.reduce((s, c) => s + (c.glowScore || 0), 0) / checks.length)
      },
    }),
    { name: 'fitcheck-ai-storage' }
  )
)

export default useStore
