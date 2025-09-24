import { getRandomAppleType } from '@/components/Objective/AppleUtils';
import { create } from 'zustand'

type AppleType = {
    value: number;
    image: string;
};

export type Objective = {
    id: string;
    x: number;
    y: number;
    size: number;
    speed: number;
    ref: React.RefObject<HTMLDivElement> | null;
    type: AppleType;
}

interface ObjectiveStore {
    apples: Objective[];
    limit: number; // Maximum number of apples allowed on screen
    fallingSpeed: number;
}

interface ObjectiveActions {
    setApples: (newApples: Objective[] | ((currentApples: Objective[]) => Objective[])) => void;
    resetObjectives: () => void;
    addApple: (apple: Objective) => void;
    createApple: () => void;
    removeApple: (id: string) => void;
    setAppleRef: (id: string, ref: React.RefObject<HTMLDivElement> | null) => void;
}

type ObjectiveStoreProps = ObjectiveStore & ObjectiveActions;

export const useObjectivesStore = create<ObjectiveStoreProps>((set) => ({
    apples: [],
    limit: 10, // Maximum number of apples allowed on screen
    fallingSpeed: 4,
    setApples: (newApples) => {
        if (newApples instanceof Function) {
            return set((state) => ({ apples: newApples(state.apples) }));
        }
        set({ apples: newApples });
    },
    resetObjectives: () => set({ apples: [] }),
    addApple: (apple) => set((state) => ({ apples: [...state.apples, apple] })),
    createApple: () => set((state) => {
        if (state.apples.length >= state.limit) return {}; // Limit reached
        const id = Math.random().toString(36).substring(2, 15);
        const apple: Objective = {
            id,
            x: Math.random() * window.innerWidth,
            y: -100,
            size: 30,
            speed: 2 + Math.random() * 3,
            ref: null,
            type: getRandomAppleType(),
        };
        return { apples: [...state.apples, apple] };
    }),
    removeApple: (id) => {
        set((state) => ({ apples: state.apples.filter(apple => apple.id !== id) }));
    },
    setAppleRef: (id, ref) => set((state) => {
        return {
            apples: state.apples.map(apple => (apple.id === id && ref) ? { ...apple, ref: ref } : apple)
        };
    })
}) as ObjectiveStoreProps);
