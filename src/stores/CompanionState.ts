import { create } from "zustand";


interface CompanionState {
    companions: Companion[];
}

interface CompanionActions {
    addCompanion: (companion: Companion) => void;
    removeCompanion: (id: string) => void;
}



type CompanionStoreProps = CompanionState & CompanionActions;

type Companion = {
    id: string;
    ref: React.RefObject<any> | null;
}

export const useCompanionStore = create<CompanionStoreProps>((set) => ({
    companions: [] as Companion[],
    removeCompanion: (id) => set((state) => ({ companions: state.companions.filter(c => c.id !== id) })),
    addCompanion: (companion: Companion) => set((state) => ({ companions: [...state.companions.filter(c => c.id !== companion.id), companion] })),
}));