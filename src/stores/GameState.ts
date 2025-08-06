import { create } from 'zustand'

export const useGameStore = create((set) => ({
    score: 0,
    setScore: (newScore) => set({ score: newScore }),
    incrementScore: (increment) => set((state) => ({ score: state.score + increment })),
    resetScore: () => set({ score: 0 }),

    currency: 0,
    setCurrency: (newCurrency) => set({ currency: newCurrency }),
    incrementCurrency: (increment) => set((state) => ({ currency: state.currency + increment })),
    resetCurrency: () => set({ currency: 0 }),
}))
