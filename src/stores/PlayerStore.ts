import { findClosestReachableApple } from '@/components/Player/getNewTarget';
import { create } from 'zustand'
import { useObjectivesStore } from './Objectives';

export const usePlayerStore = create((set) => ({
    id: 'player1',
    x: 100,
    y: 100,
    playerRef: null, // This will hold the reference to the player sprite
    setPlayerRef: (ref) => set(() => ({
        playerRef: ref
    })),



    // Auto-move
    movementSpeed: 5,
    target: null,
    getNewTarget: () => set((state) => {
        const apples = useObjectivesStore.getState().apples;
        if (!apples || apples.length === 0) return { target: null };
        if (!state.playerRef) return { target: null };
        const closestApple = findClosestReachableApple(apples, state.playerRef);
        return { target: closestApple ? closestApple : null };
    }),
}))
