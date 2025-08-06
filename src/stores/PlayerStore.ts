import { create } from 'zustand'

export const usePlayerStore = create((set) => ({
    id: 'player1',
    x: 100,
    y: 100,
    playerRef: null, // This will hold the reference to the player sprite

    setPlayerRef: (ref) => set(() => ({
        playerRef: ref.current
    }))
}))
