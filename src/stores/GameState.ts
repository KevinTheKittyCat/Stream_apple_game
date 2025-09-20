import { getStorageItem, setStorageItem } from '@/components/UtilFunctions/Storage/storageHelper';
import { create } from 'zustand'

type pages = 'game' | 'talentTree' | 'settings' | 'leaderboard';

export const useGameStore = create((set) => ({
    state: 'playing' as 'playing' | 'paused' | 'gameOver',
    currentPage: 'game' as pages,
    setCurrentPage: (page) => set({ currentPage: page }),
    score: 0,
    lastScore: 0,
    setScore: (newScore) => set({ score: newScore }),
    setLastScore: (newLastScore) => set({ lastScore: newLastScore }),
    incrementScore: (increment) => set((state) => ({ score: Math.max(state.score + increment, 0) })),
    resetScore: () => set({ score: 0 }),

    currency: Number(getStorageItem("currency")) || 0,
    setCurrency: (newCurrency) => set(() => {
        setStorageItem("currency", newCurrency);
        return { currency: newCurrency };
    }),
    incrementCurrency: (increment) => set((state) => {
        const newCurrency = state.currency + increment;
        setStorageItem("currency", newCurrency);
        return { currency: newCurrency };
    }),
    resetCurrency: () => set({ currency: 0 }),

    time: new Date(),
    extraTime: 0,
    timer: 5,
    startTime: 5,
    totalTime: 0,
    restartGame: () => set((state) => {
        state.resetTimer();
        return {
            state: 'playing',
            score: 0,
        }
    }),
    gameOver: () => set({ state: 'gameOver' }),
    pauseGame: () => set({ state: 'paused' }),
    unpauseGame: () => set({ state: 'playing' }),
    resetTimer: () => set((state) => ({ timer: state.startTime, time: new Date(), totalTime: 0 })),
    updateTimer: (number) => set((state) => {
        const final = state.timer + number;
        if (final <= 0) {
            // If the timer reaches 0, trigger any necessary game over logic
            state.incrementCurrency(state.score);
            state.resetScore();
            state.setLastScore(state.score);
            state.gameOver();
        }
        return {
            timer: final > 0 ? final : 0,
            totalTime: final > 0 ? state.totalTime - number : state.totalTime
        };
    }),


    modifiers: {
        red_apple: { add: 1, multiply: 1, spawnRate: 1, onHit: () => { } },
    }
}))
