import { getStorageItem, setItemRemoveRefStringify } from '@/components/UtilFunctions/Storage/storageHelper';
import { create } from 'zustand'

interface TalentTreeState {
    talents: TalentType[];
}

interface TalentTreeActions {
    addTalent: (talent: TalentType) => void;
    createTalent: (talent: TalentType) => void;
    updateTalent: (id: string, updatedFields: Partial<TalentType>) => void;
    setTalentRef: (id: string, ref: React.RefObject<HTMLDivElement> | null) => void;
}

type TalentTreeStoreProps = TalentTreeState & TalentTreeActions;

export const useTalentTreeStore = create<TalentTreeStoreProps>((set) => ({
    talents: getStorageItem("talents") || [],
    addTalent: (talent) => { set((state) => ({ talents: [...state.talents, talent] })) },
    createTalent: (talent) => {
        set((state) => {
            const newTalents = [...state.talents, talent];
            setItemRemoveRefStringify("talents", newTalents);
            return { talents: newTalents }
        });
    },
    updateTalent: (id, updatedFields) => set((state) => {
        console.log("Updating talent", id, updatedFields);
        const newTalents = state.talents.map(talent => talent.id === id ? { ...talent, ...updatedFields } : talent);
        setItemRemoveRefStringify("talents", newTalents);
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
    effects: Array<{ type: string; multiply?: number, add?: number, set?: number, minus?: number }>;
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
            if (e?.multiply) acc *= e.multiply * talent.currentLevel;
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

export const JSONTALENTS = {
    firstTalent: {
        id: "upgrade_scale",
        levels: 5,
        currentLevel: 1,
        title: "Scale",
        description: "Increases the scale of the apple.",
        effects: [
            { type: "scale", multiply: 1.2 }
        ],
        prerequisites: [],
        spawnOn: { x: 500, y: 500 },
        settled: 2,
        image: "/assets/fruits/Apple.png",
        cost: 20,
        costMultiplier: 1.5,
    },
    secondTalent: {
        id: "upgrade_fall_speed",
        levels: 5,
        currentLevel: 1,
        title: "Fall Speed",
        description: "Increases the fall speed of the apple.",
        effects: [
            { type: "fallSpeed", multiply: 1.2 }
        ],
        prerequisites: [{ id: "upgrade_scale", level: 2 }],
        spawnOn: { ref: "upgrade_scale", pos: { x: 2, y: -2 } },
        settled: 0,
        image: "/assets/fruits/Orange.png",
        cost: 10,
        costMultiplier: 1.5,
    },
    thirdTalent: {
        id: "upgrade_player_speed",
        levels: 5,
        currentLevel: 1,
        title: "Player Speed",
        description: "Increases the speed of the player.",
        effects: [
            { type: "playerSpeed", multiply: 1.2 }
        ],
        prerequisites: [{ id: "upgrade_scale", level: 2 }],
        spawnOn: { ref: "upgrade_scale", pos: { x: 2, y: -2 } },
        settled: 0,
        image: "/assets/fruits/Banana.png",
        cost: 15,
        costMultiplier: 1.5,
    },
    fourthTalent: {
        id: "upgrade_apple_value",
        levels: 5,
        currentLevel: 1,
        title: "Apple Value",
        description: "Increases the value of the apple.",
        effects: [
            { type: "appleValue", add: 1 }
        ],
        prerequisites: [{ id: "upgrade_player_speed", level: 2 }],
        spawnOn: { ref: "upgrade_scale", pos: { x: 2, y: -2 } },
        settled: 0,
        image: "/assets/fruits/Banana.png",
        cost: 15,
        costMultiplier: 1.5,
    }
};