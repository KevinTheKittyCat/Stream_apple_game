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
    movementSpeed: 2,
    target: null,
    getNewTarget: () => set((state) => {
        const { apples, fallingSpeed } = useObjectivesStore.getState();
        if (!apples || apples.length === 0) return { target: null };
        if (!state.playerRef) return { target: null };
        const closestApple = findClosestReachableApple({
            apples,
            ref: state.playerRef,
            refOffset: { x: 0, y: 100 * (fallingSpeed / state.movementSpeed + 1) }, // Adjust for player height
            appleOffset: { x: 0, y: 0 }
        });
        return { target: closestApple ? closestApple : null };
    }),
}))
