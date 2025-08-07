import { useObjectivesStore } from "@/stores/Objectives";



export function useAppleSpawner() {
    const { setApples, addApple, removeApple, apples } = useObjectivesStore();

    const spawnApple = () => {
        const id = Math.random().toString(36).substring(2, 15);
        const apple = {
            id,
            ref: null, // This will be set when the apple is rendered
            x: Math.random() * window.innerWidth,
            y: 100,
        };
        addApple(apple);
    }

    const setAppleRef = (id: string, ref: React.RefObject<any>) => {
        setApples((prevApples) => {
            return prevApples.map(apple => (apple.id === id && ref) ? { ...apple, ref:ref } : apple);
        });
    }

    return { spawnApple, removeApple, setAppleRef };
}