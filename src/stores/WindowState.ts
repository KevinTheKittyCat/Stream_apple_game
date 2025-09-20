import { create } from 'zustand'

export const useWindowStore = create((set) => ({
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    calculateScale: () => set((state) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scaleX = width / 1920;
        const scaleY = height / 1080;
        const newScale = Math.max(Math.min(scaleX, scaleY), 0.5);
        return { scale: newScale, scaleX, scaleY };
    }),
    setScale: (newScale) => set({ scale: newScale }),
    offset: { x: 0, y: 0 },
    setOffset: (newOffset) => set({ offset: newOffset }),
}))
