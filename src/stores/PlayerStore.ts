import { findClosestReachableObjective } from '@/components/Player/getNewTarget';
import { type Sprite as PixiSprite } from 'pixi.js';
import { create } from 'zustand';
import { useObjectivesStore, type Objective } from './Objectives';


type TargettingAutoMove = {
    target: Objective | null;
    getNewTarget: () => void;
}

interface PlayerState {
    id: string;
    x: number;
    y: number;
    playerRef: React.RefObject<PixiSprite> | null; // This will hold the reference to the player sprite
}

interface PlayerActions {
    setPlayerRef: (ref: React.RefObject<PixiSprite> | null) => void;
    resetPlayer: () => void;
}

type PlayerStoreProps = PlayerState & PlayerActions & TargettingAutoMove;

export const usePlayerStore = create<PlayerStoreProps>((set) => ({
    id: 'player1',
    x: 100,
    y: 100,

    playerRef: null, // This will hold the reference to the player sprite
    setPlayerRef: (ref: React.RefObject<PixiSprite> | null) => set(() => ({
        playerRef: ref
    })),

    resetPlayer: () => set((state) => {
        if (!state.playerRef || !state.playerRef.current) return {};
        state.playerRef.current.x = window.innerWidth / 2;
        state.playerRef.current.y = window.innerHeight * 0.9;
        return {};
    }),

    // Auto-move
    target: null,
    getNewTarget: () => set((state) => {
        const { apples, fallingSpeed } = useObjectivesStore.getState();
        if (!apples || apples.length === 0) return { target: null };
        if (!state.playerRef) return { target: null };
        const closestApple = findClosestReachableObjective({
            objectives: apples.filter(a => a.type.value > 0), // Only target apples with positive value
            ref: state.playerRef,
            refOffset: { x: 0, y: (window.innerHeight / 10) * (fallingSpeed / 1.2) }, // Adjust for player height
            objectiveOffset: { x: 0, y: 0 }
        });
        return { target: closestApple };
    }),
}))
