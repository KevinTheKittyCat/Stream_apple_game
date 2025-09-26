import { create } from "zustand";




export const usePortalStore = create<WindowStoreProps>((set) => ({
    portalRef: null, // This will hold the reference to the portal sprite
    setPortalRef: (ref: React.RefObject<HTMLDivElement> | null) => set(() => ({
        portalRef: ref
    })),
}))