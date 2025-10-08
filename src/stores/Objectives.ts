import { createPowerupTypeModifiers } from '@/components/Game/Powerups/handlePowerupFunctions';
import { getRandomAppleType } from '@/components/Objective/AppleUtils';
import { getTalentEffect } from '@/components/UtilFunctions/talents';
import { type Sprite as PixiSprite } from 'pixi.js';
import { create } from 'zustand';
import { useGameStore } from './GameState';

export type ObjectiveType = {
    value: number;
    image: string;
    id: string;
    onHit?: (apple: PixiSprite) => void;
    group: string[];
    weight?: number;
};

export type Objective = {
    id: string;
    x: number;
    y: number;
    size: number;
    speed: number;
    ref: React.RefObject<PixiSprite | null> | null;
    type: ObjectiveType;
};

interface ObjectiveStore {
    objectives: {
        ids: string[];
        byId: Record<string, Objective>;
        byType: Record<string, { [id: string]: Objective }>;
    };
    limit: number; // Maximum number of apples allowed on screen
    fallingSpeed: number;
};

interface ObjectiveActions {
    resetObjectives: () => void;
    createApple: () => void;
    setAppleRef: (id: string, ref: React.RefObject<PixiSprite | null> | null) => void;


    addObjective: (objective: Objective) => void;
    removeObjective: (id: string) => void;
    updateObjective: (id: string, newData: Partial<Objective>) => void;
    getObjectivesByType: (typeId: string) => Objective[];
};

type ObjectiveStoreProps = ObjectiveStore & ObjectiveActions;

export const useObjectivesStore = create<ObjectiveStoreProps>((set) => ({
    limit: 10000, // Maximum number of apples allowed on screen
    fallingSpeed: 4,
    resetObjectives: () => set({ objectives: { ids: [], byId: {}, byType: {} } }),
    createApple: () => set((state) => {
        if (useGameStore.getState().state !== 'playing') return {}; // Return unchanged state instead of empty object

        const id = Math.random().toString(36).substring(2, 15);
        const objective: Objective = {
            id,
            x: Math.random() * window.innerWidth,
            y: -100,
            size: getTalentEffect(30, "scale"), // Scale with talents
            speed: getTalentEffect(3, "fallSpeed") + Math.random() * 3, // Base speed + talent effect
            ref: null,
            type: getRandomAppleType(createPowerupTypeModifiers()),
        };

        // Create new arrays and objects to ensure proper reactivity
        const newIds = [...state.objectives.ids, objective.id];
        const newById = { ...state.objectives.byId, [objective.id]: objective };
        const newByType = { ...state.objectives.byType };

        if (!newByType[objective.type.id]) {
            newByType[objective.type.id] = {};
        } else {
            newByType[objective.type.id] = { ...newByType[objective.type.id] };
        }
        newByType[objective.type.id][objective.id] = objective;

        return {
            objectives: {
                ids: newIds,
                byId: newById,
                byType: newByType
            }
        };
    }),
    setAppleRef: (id, ref) => set((state) => {
        state.objectives.byId[id].ref = ref;
        return {};
    }),



    objectives: {
        ids: [] as string[],
        byId: {} as Record<string, Objective>,
        byType: {} as Record<string, { [id: string]: Objective }>,
    },
    addObjective: (objective: Objective) => set((state) => {
        if (state.objectives.byId[objective.id]) return {}; // Already exists
        const newIds = [...state.objectives.ids, objective.id];
        const newById = { ...state.objectives.byId, [objective.id]: objective };
        const newByType = { ...state.objectives.byType };

        if (!newByType[objective.type.id]) {
            newByType[objective.type.id] = {};
        } else {
            newByType[objective.type.id] = { ...newByType[objective.type.id] };
        }
        newByType[objective.type.id][objective.id] = objective;

        return {
            objectives: {
                ids: newIds,
                byId: newById,
                byType: newByType
            }
        };
    }),
    removeObjective: (id: string) => set((state) => {
        if (!state.objectives.byId[id]) return {};
        const type = state.objectives.byId[id].type;
        const newIds = state.objectives.ids.filter(oid => oid !== id);
        const newById = { ...state.objectives.byId };
        delete newById[id];
        const newByType = { ...state.objectives.byType };
        delete newByType[type.id][id];
        return {
            objectives: {
                ids: newIds,
                byId: newById,
                byType: newByType
            }
        };
    }),
    updateObjective: (id: string, newData: Partial<Objective>) => set((state) => {
        if (!state.objectives.byId[id]) return {};
        const objective = state.objectives.byId[id];
        Object.assign(objective, newData);
        state.objectives.byType[objective.type.id][id] = objective;
        return { objectives: state.objectives };
    }),
    getObjectivesByType: (typeId: string) => {
        return Object.values(useObjectivesStore.getState().objectives.byType[typeId] || {});
    },
}));

