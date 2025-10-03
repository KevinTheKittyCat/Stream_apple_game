import { getStorageItem, setStorageItem } from '@/components/UtilFunctions/Storage/storageHelper';
import { create } from 'zustand'
import { useObjectivesStore } from './Objectives';
import { getTalentEffect } from '@/components/UtilFunctions/talents';
import type { TalentType } from '@/components/Game/TalentTree/Settings/all';

type ScoreType = {
    [key: string]: {
        value: number;
        singleValue: number;
        image: string;
        amount: number;
    };
} & { total: number };

interface GameState {
    state: 'playing' | 'paused' | 'gameOver';
    score: ScoreType;
    lastScore: ScoreType;

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

    setScore: (newScore: ScoreType) => void;
    setLastScore: (newLastScore: ScoreType) => void;
    incrementScore: (increment: TalentType) => void;
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
    score: { total: 0 },
    lastScore: { total: 0 },
    setScore: (newScore) => set({ score: newScore }),
    setLastScore: (newLastScore) => set({ lastScore: newLastScore }),
    incrementScore: (type) => set((state) => {
        const finalValue = Math.floor(getTalentEffect(type.value, type.group || []));
        return {
            score: {
                ...state.score,
                [type.id]: {
                    value: (state.score[type.id]?.value || 0) + finalValue,
                    singleValue: finalValue,
                    image: type.image,
                    amount: (state.score[type.id]?.amount || 0) + 1
                },
                total: (state.score.total || 0) + finalValue
            }
        };
    }),
    resetScore: () => set({ score: { total: 0 } }),
    currency: Number(getStorageItem("currency")) || 0,
    setCurrency: (newCurrency) => set(() => {
        setStorageItem("currency", newCurrency);
        return { currency: newCurrency };
    }),
    incrementCurrency: (increment) => set((state) => {
        const newCurrency = Math.max(state.currency + increment, 0);
        setStorageItem("currency", newCurrency);
        return { currency: newCurrency };
    }),
    resetCurrency: () => set({ currency: 0 }),

    time: new Date(),
    extraTime: 0,
    timer: getTalentEffect(10, "time"),
    startTime: getTalentEffect(10, "time"),
    totalTime: 0,
    restartGame: () => set((state) => {
        const { resetObjectives } = useObjectivesStore.getState();
        state.resetTimer();
        resetObjectives();
        return {
            state: 'playing',
            score: { total: 0 },
        }
    }),
    gameOver: () => set((state) => {
        state.incrementCurrency(state.score.total);
        state.setLastScore(state.score);
        state.resetScore();
        return {
            state: 'gameOver',
        };
    }),
    pauseGame: () => set({ state: 'paused' }),
    unpauseGame: () => set({ state: 'playing' }),
    resetTimer: () => set(() => ({ timer: getTalentEffect(10, "time"), time: new Date(), totalTime: 0, startTime: getTalentEffect(10, "time") })),
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
