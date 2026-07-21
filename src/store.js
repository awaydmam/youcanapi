import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // Skin DNA
      skinDNA: null,
      selfieUrl: null,
      bodyPhotoUrl: null,
      setSkinDNA: (dna) => set({ skinDNA: dna }),
      setSelfieUrl: (url) => set({ selfieUrl: url }),
      setBodyPhotoUrl: (url) => set({ bodyPhotoUrl: url }),

      // Product checks
      checks: [],
      addCheck: (check) => set((s) => ({ checks: [check, ...s.checks] })),
      getCheck: (id) => get().checks.find((c) => c.id === id),

      // Stats
      get totalChecks() { return get().checks.length },
      get moneySaved() {
        return get().checks
          .filter((c) => c.verdict === 'SKIP')
          .reduce((sum, c) => sum + (c.estimatedPrice || 25), 0)
      },

      // Dark mode
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Reset
      resetSkinDNA: () => set({ skinDNA: null, selfieUrl: null, bodyPhotoUrl: null }),
    }),
    { name: 'fitcheck-ai-storage' }
  )
)

export default useStore
