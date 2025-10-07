import type { Objective } from "@/stores/Objectives";
import { useWindowStore } from "@/stores/WindowState";




export function removeOffscreen(objectives: Objective[]) {
    const { height } = useWindowStore.getState();
    return objectives.filter(apple => {
        if (!apple.ref || !apple.ref.current) return false;
        const { y } = apple.ref.current;
        return height * 0.1 <= y && y <= height * 0.9; // Keep if within 10% to 90% of screen height
    });
}