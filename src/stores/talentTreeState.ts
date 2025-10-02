import { checkPrerequisites } from '@/components/Game/TalentTree/NewTalentTree';
import { allTalents } from '@/components/Game/TalentTree/Settings/all';
import { getStorageItem, setItemRemoveRefStringify } from '@/components/UtilFunctions/Storage/storageHelper';
import { Container } from 'pixi.js';
import { create } from 'zustand'

interface TalentTreeState {
    talents: TalentType[];
    hoveringTalent: { x: number; y: number } & TalentType | null;
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

type TalentDict = { [key: string]: TalentType };

const getStorageSafeTalents = () => {
    const fromStorage: Partial<TalentType>[] = getStorageItem("talents") || [];
    let allTalentsConcatted = {...allTalents} as TalentDict;
    fromStorage.forEach(t => {
        allTalentsConcatted[t.id as keyof typeof allTalents] = {...allTalentsConcatted[t.id as keyof typeof allTalents], ...t};
    });
    const talentsArray = Object.values(allTalentsConcatted);

    return fromStorage.reduce((acc, t) => {
        const foundTalent = allTalents[t.id as keyof typeof allTalents];
        if (!foundTalent) return acc; // Ignore talents that no longer exist
        const combined = {...foundTalent, ...t} as TalentType;
        // Remove talents that no longer meet prerequisites
        if (!checkPrerequisites(combined, talentsArray)) return acc;
        return acc.concat(combined);
    }, [] as TalentType[]);
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

export type effect = {
    type: string;
    multiply?: number,
    divide?: number,
    add?: number,
    set?: number,
    minus?: number,

    prefix?: string | React.JSX.Element | React.ComponentType<any>,
    suffix?: string | React.JSX.Element | React.ComponentType<any>,
}

export type TalentType = {
    id: string;
    position?: { x: number; y: number } | null;
    levels: number;
    currentLevel: number;
    title: string;
    description: string;
    effects: effect[];
    prerequisites: Array<{ id: string; level: number }>;
    spawnOn: { x: number; y: number };
    settled: number;
    image: string;
    cost: number,
    costMultiplier: number,
};

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
