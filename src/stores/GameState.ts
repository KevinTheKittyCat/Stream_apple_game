import { getStorageItem, setStorageItem } from '@/components/UtilFunctions/Storage/storageHelper';
import { create } from 'zustand'
import { useObjectivesStore } from './Objectives';

interface GameState {
    state: 'playing' | 'paused' | 'gameOver';
    score: number;
    lastScore: number;

    currency: number;

    time: Date;
    extraTime: number;
    timer: number;
    startTime: number;
    totalTime: number;
}

interface GameActions {
    restartGame: () => void;
    gameOver: () => void;
    pauseGame: () => void;
    unpauseGame: () => void;

    setScore: (newScore: number) => void;
    setLastScore: (newLastScore: number) => void;
    incrementScore: (increment: number) => void;
    resetScore: () => void;

    setCurrency: (newCurrency: number) => void;
    incrementCurrency: (increment: number) => void;
    resetCurrency: () => void;
    resetTimer: () => void;
    updateTimer: (number: number) => void;
}

interface Modifiers {
    // NOT DEVELOPED YET
    // CURRENTLY DOUBLED WITH TALENTTREESTATE
}

type GameStoreProps = GameState & GameActions;


export const useGameStore = create<GameStoreProps>((set) => ({
    state: 'playing',
    score: 0,
    lastScore: 0,
    setScore: (newScore) => set({ score: newScore }),
    setLastScore: (newLastScore) => set({ lastScore: newLastScore }),
    incrementScore: (increment) => set((state) => ({ score: Math.max(state.score + increment + 1000, 0) })),
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
    timer: 10,
    startTime: 10,
    totalTime: 0,
    restartGame: () => set((state) => {
        const { resetObjectives } = useObjectivesStore.getState();
        state.resetTimer();
        resetObjectives();


        return {
            state: 'playing',
            score: 0,
        }
    }),
    gameOver: () => set((state) => {
        state.incrementCurrency(state.score);
        state.setLastScore(state.score);
        state.resetScore();
        return {
            state: 'gameOver',
        };
    }),
    pauseGame: () => set({ state: 'paused' }),
    unpauseGame: () => set({ state: 'playing' }),
    resetTimer: () => set((state) => ({ timer: state.startTime, time: new Date(), totalTime: 0 })),
    updateTimer: (number) => set((state) => {
        const final = state.timer + number;
        if (state.state !== 'playing') return {};
        if (final <= 0) {
            // If the timer reaches 0, trigger any necessary game over logic
            //state.incrementCurrency(state.score);
            //state.setLastScore(state.score);
            //state.resetScore();
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
}) as GameState & GameActions);
