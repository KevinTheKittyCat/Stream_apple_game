import { checkPrerequisites } from '@/components/Game/TalentTree/NewTalentTree';
import { allTalents, type TalentDict, type TalentType } from '@/components/Game/TalentTree/Settings/all';
import { getStorageItem, setStorageItem } from '@/components/UtilFunctions/Storage/storageHelper';
import { Container } from 'pixi.js';
import { create } from 'zustand';

interface TalentTreeState {
    talents: TalentType[];
    talentsDict: TalentDict;
    hoveringTalent: ({ x: number; y: number } & TalentType) | null;
}

interface TalentTreeActions {
    addTalent: (talent: TalentType) => void;
    createTalent: (talent: TalentType) => void;
    updateTalent: (id: string, updatedFields: Partial<TalentType>) => void;
    setTalentRef: (id: string, ref: React.RefObject<Container> | null) => void;
    setHoveringTalent: (talent: ({ x: number; y: number } & TalentType) | null) => void;
    updateTalentsDict: (talents: TalentType[]) => void;
}

type TalentTreeStoreProps = TalentTreeState & TalentTreeActions;

const handleCreateDict = (talents: TalentType[]) => {
    return talents.reduce((acc, talent) => {
        if (talent.id) acc[talent.id] = talent;
        return acc;
    }, {} as TalentDict)
}

const setStorageSafeTalents = (newTalents: TalentType[]) => {
    const storage = newTalents.map(t => ({
        id: t.id,
        position: t.position,
        //levels: t.levels,
        currentLevel: t.currentLevel,
        settled: t.settled,
    }));
    setStorageItem("talents", storage);
    return storage;
}

const getStorageSafeTalents = () => {
    const fromStorage: Partial<TalentType>[] = getStorageItem("talents") || [];
    let allTalentsConcatted = { ...allTalents } as TalentDict;
    fromStorage.forEach(t => {
        allTalentsConcatted[t.id as keyof typeof allTalents] = { ...allTalentsConcatted[t.id as keyof typeof allTalents], ...t };
    });
    const talentsArray = Object.values(allTalentsConcatted);

    const storageSafeTalents = fromStorage.reduce((acc, t) => {
        const foundTalent = allTalents[t.id as keyof typeof allTalents];
        if (!foundTalent) return acc; // Ignore talents that no longer exist

        // Calculate cost properly using base cost and multiplier
        const baseCost = foundTalent.cost || 1;
        const costMultiplier = foundTalent.costMultiplier || 1.5;
        const currentLevel = t.currentLevel || 0;

        // Cost formula: baseCost * (multiplier ^ currentLevel)
        const calculatedCost = Math.round(baseCost * Math.pow(costMultiplier, currentLevel));

        const combined = {
            ...foundTalent,
            ...t,
            cost: calculatedCost
        } as TalentType;
        // Remove talents that no longer meet prerequisites
        if (!checkPrerequisites(combined, talentsArray)) return acc;
        return acc.concat(combined);
    }, [] as TalentType[]);
    return {
        talents: storageSafeTalents,
        talentsDict: handleCreateDict(storageSafeTalents)
    };
}

export const useTalentTreeStore = create<TalentTreeStoreProps>((set) => ({
    talents: getStorageSafeTalents().talents,
    talentsDict: getStorageSafeTalents().talentsDict,
    hoveringTalent: null,
    setHoveringTalent: (talent) => set({ hoveringTalent: talent }),
    addTalent: (talent) => { set((state) => ({ talents: [...state.talents, talent] })) },
    createTalent: (talent) => {
        set((state) => {
            const newTalents = [...state.talents, talent];
            setStorageSafeTalents(newTalents);
            return { talents: newTalents, talentsDict: handleCreateDict(newTalents) };
        });
    },
    updateTalent: (id, updatedFields) => set((state) => {
        const newTalents = state.talents.map(talent => talent.id === id ? { ...talent, ...updatedFields } : talent);
        setStorageSafeTalents(newTalents);
        return { talents: newTalents, talentsDict: handleCreateDict(newTalents) };
    }),
    // @ts-ignore
    setTalentRef: (id, ref) => set((state) => {
        return {
            talents: state.talents.map(talent => (talent.id === id && ref) ? { ...talent, ref: ref } : talent),
            talentsDict: {...state.talentsDict, [id]: { ...state.talentsDict[id], ref: ref } }
        };
    }),

    updateTalentsDict: (talents) => set((state) => ({
        talentsDict: handleCreateDict(state.talents.concat(talents || []))
    }))
}));
