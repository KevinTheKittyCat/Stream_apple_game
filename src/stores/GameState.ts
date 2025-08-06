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

    time: new Date(),
    extraTime: 0,
    timer: 5,
    startTime: 5,
    totalTime: 0,
    resetTimer: () => set((state) => ({ timer: state.startTime, time: new Date(), totalTime: 0 })),
    updateTimer: (number) => set((state) => {
        const final = state.timer + number
        return {
            timer: final > 0 ? final : 0,
            totalTime: final > 0 ? state.totalTime - number : state.totalTime
        }
    }),
}))
