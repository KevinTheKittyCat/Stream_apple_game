import { getRandomAppleType } from '@/components/Objective/AppleUtils';
import { create } from 'zustand'

export const useObjectivesStore = create((set) => ({
    apples: [],
    fallingSpeed: 4,
    setApples: (newApples) => {
        if (newApples instanceof Function) {
            set((state) => ({ apples: newApples(state.apples) }));
            return;
        }
        set({ apples: newApples });
    },
    addApple: (apple) => set((state) => ({ apples: [...state.apples, apple] })),
    createApple: () => {
        const id = Math.random().toString(36).substring(2, 15);
        const apple = {
            id,
            x: Math.random() * window.innerWidth,
            y: -100,
            size: 30,
            speed: 2 + Math.random() * 3,
            ref: null,
            type: getRandomAppleType(),
        };
        return apple;
    },
    removeApple: (id) => {
        set((state) => ({ apples: state.apples.filter(apple => apple.id !== id) }));
    },
    setAppleRef: (id, ref) => set((state) => {
        return {
            apples: state.apples.map(apple => (apple.id === id && ref) ? { ...apple, ref: ref } : apple)
        };
    })
}))
