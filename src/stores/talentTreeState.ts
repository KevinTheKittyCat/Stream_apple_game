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
    effects: Array<{ type: string; multiply: number }>;
    prerequisites: Array<{ id: string; level: number }>;
    spawnOn: { x: number; y: number };
    settled: number;
    image: string;
};

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
        image: "/assets/fruits/Apple.png"
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
        prerequisites: [{ id: "upgrade_scale", level: 1 }],
        spawnOn: { ref: "upgrade_scale", pos: { x: 2, y: -2 } },
        settled: 0,
        image: "/assets/fruits/Orange.png"
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
        prerequisites: [{ id: "upgrade_scale", level: 1 }],
        spawnOn: { ref: "upgrade_scale", pos: { x: 2, y: -2 } },
        settled: 0,
        image: "/assets/fruits/Banana.png"
    }
};