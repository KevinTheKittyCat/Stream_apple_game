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
    removeApple: (id) => {
        set((state) => ({ apples: state.apples.filter(apple => apple.id !== id) }));
    },
    setAppleRef: (id, ref) => set((state) => {
        return {
            apples: state.apples.map(apple => (apple.id === id && ref) ? { ...apple, ref: ref } : apple)
        };
    })
}))
