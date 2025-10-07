import { create } from 'zustand';

interface WindowState {
    scale: number;
    scaleX: number;
    scaleY: number;
    width: number;
    height: number;
    offset: { x: number; y: number };
}

interface WindowActions {
    calculateDimensions: () => void;
    calculateScale: () => void;
    setScale: (newScale: number) => void;
    setOffset: (newOffset: { x: number; y: number }) => void;
}


type WindowStoreProps = WindowState & WindowActions;

export const useWindowStore = create<WindowStoreProps>((set) => ({
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    width: window.innerWidth,
    height: window.innerHeight,
    offset: { x: 0, y: 0 },

    calculateDimensions: () => set(() => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }),

    calculateScale: () => set(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scaleX = width / 1920;
        const scaleY = height / 1080;
        const newScale = Math.max(Math.min(scaleX, scaleY), 0.5);
        return { scale: newScale, scaleX, scaleY };
    }),
    setScale: (newScale) => set({ scale: newScale }),
    setOffset: (newOffset) => set({ offset: newOffset }),
}))
