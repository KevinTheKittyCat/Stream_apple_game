import { allTalents } from '@/components/Game/TalentTree/Settings/all';
import { getStorageItem, setItemRemoveRefStringify } from '@/components/UtilFunctions/Storage/storageHelper';
import { Container } from 'pixi.js';
import { create } from 'zustand'

interface TalentTreeState {
    talents: TalentType[];
    hoveringTalent: TalentType | null;
}

interface TalentTreeActions {
    addTalent: (talent: TalentType) => void;
    createTalent: (talent: TalentType) => void;
    updateTalent: (id: string, updatedFields: Partial<TalentType>) => void;
    setTalentRef: (id: string, ref: React.RefObject<Container> | null) => void;
    setHoveringTalent: (talent: TalentType | null) => void;
}

type TalentTreeStoreProps = TalentTreeState & TalentTreeActions;

const setStorageSafeTalents = (newTalents) => {
    const storage = newTalents.map(t => ({
        id: t.id,
        position: t.position,
        levels: t.levels,
        currentLevel: t.currentLevel,
        settled: t.settled,
    }));
    setItemRemoveRefStringify("talents", storage);
    return storage;
}

const getStorageSafeTalents = () => {
    const fromStorage = getStorageItem("talents") || [];
    return fromStorage.map(t => ({
        ...allTalents[t.id as keyof typeof allTalents],
        ...t,
    })) as TalentType[];
}

export const useTalentTreeStore = create<TalentTreeStoreProps>((set) => ({
    talents: getStorageSafeTalents(),
    hoveringTalent: null,
    setHoveringTalent: (talent) => set({ hoveringTalent: talent }),
    addTalent: (talent) => { set((state) => ({ talents: [...state.talents, talent] })) },
    createTalent: (talent) => {
        set((state) => {
            const newTalents = [...state.talents, talent];
            setStorageSafeTalents(newTalents);
            return { talents: newTalents }
        });
    },
    updateTalent: (id, updatedFields) => set((state) => {
        const newTalents = state.talents.map(talent => talent.id === id ? { ...talent, ...updatedFields } : talent);
        setStorageSafeTalents(newTalents);
        return { talents: newTalents };
    }),
    setTalentRef: (id, ref) => set((state) => {
        //console.log(id, ref);
        return {
            talents: state.talents.map(talent => (talent.id === id && ref) ? { ...talent, ref: ref } : talent)
        };
    })
}))

export type TalentType = {
    id: string;
    position?: { x: number; y: number } | null;
    levels: number;
    currentLevel: number;
    description: string;
    effects: Array<{ type: string; multiply?: number, divide?: number, pow?: number, add?: number, set?: number, minus?: number }>;
    prerequisites: Array<{ id: string; level: number }>;
    spawnOn: { x: number; y: number };
    settled: number;
    image: string;
    cost: number,
    costMultiplier: number,
};

export const getTalentEffect = (originalNumber: number, type: string): number => {
    const talents = useTalentTreeStore.getState().talents
    const number = talents.reduce((acc: number, talent) => {
        const effects = talent.effects.filter(e => e.type === type);
        effects.forEach(e => {
            if (e?.multiply) acc *= Math.pow(e.multiply, talent.currentLevel);
            if (e?.divide) acc /= Math.pow(e.divide, talent.currentLevel);
            if (e?.add) acc += e.add * talent.currentLevel;
            if (e?.set) acc = e.set * talent.currentLevel;
            if (e?.minus) acc -= e.minus * talent.currentLevel;
        });
        return acc;
    }, originalNumber as number);
    return number;
}
/*
export const getTalentEffects = (): number => {
    const talents = useTalentTreeStore.getState().talents
    return talents.reduce((acc: Record<string, number>, talent) => {
        const effects = talent.effects.forEach(e => {
            if (e.type !== acc[e.type]) acc[e.type] = originalNumber;
            if (e.multiply) acc[e.type] *= e.multiply;
            if (e.add) acc[e.type] += e.add;
            if (e.set) acc[e.type] = e.set;
            if (e.minus) acc[e.type] -= e.minus;
        });
    }, {} as Record<string, number>);
}*/
