import { create } from "zustand";



type PortalState = {
    portalRef: React.RefObject<HTMLDivElement | null> | null; // This will hold the reference to the portal sprite
};

type PortalActions = {
    setPortalRef: (ref: React.RefObject<HTMLDivElement | null>) => void;
};

type PortalStoreProps = PortalState & PortalActions;

export const usePortalStore = create<PortalStoreProps>((set) => ({
    portalRef: null, // This will hold the reference to the portal sprite
    setPortalRef: (ref: React.RefObject<HTMLDivElement | null>) => set(() => ({
        portalRef: ref
    })),
}))