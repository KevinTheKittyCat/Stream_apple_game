import { create } from 'zustand'

export type MouseCoords = { x: number | null; y: number | null } | null;

interface CanvasState {
    mouseCoordsRef: React.RefObject<MouseCoords> | null;
}

interface CanvasActions {
    setMouseCoordsRef: (ref: React.RefObject<MouseCoords> | null) => void;
}

type CanvasStoreProps = CanvasState & CanvasActions;


export const useCanvasStore = create<CanvasStoreProps>((set) => ({
    mouseCoordsRef: null,
    setMouseCoordsRef: (ref) => set({ mouseCoordsRef: ref })
}));
