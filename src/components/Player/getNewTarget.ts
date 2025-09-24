import type { Objective } from "@/stores/Objectives";

type findClosestProps = {
    objectives: Objective[],
    ref: React.RefObject<any> | null,
    refOffset: { x: number, y: number },
    objectiveOffset: { x: number, y: number }
}

export const findClosestReachableObjective = ({
    objectives,
    ref,
    refOffset = { x: 0, y: 0 },
    objectiveOffset = { x: 0, y: 0 }
}: findClosestProps) => {
    if (!ref || !ref.current) return null; // Ensure ref is valid
    const { x, y } = ref.current.position

    const closestObjective = objectives.reduce((acc, objective) => {
        if (!objective.ref || !objective.ref.current || !objective.ref.current.position) return acc; // Ensure objective has a valid ref
        if (objective.type.value < 0) return acc; // Skip if objective is not reachable
        const pos = objective.ref.current.position
        const distance = Math.sqrt(
            // TODO ADD OBJECTIVE OFFSET
            (pos.x - x + refOffset.x) ** 2 +
            (pos.y - y + refOffset.y) ** 2
        );
        const objectiveObject = {
            distance,
            ...objective,
            ref: objective.ref,
        }
        if (!acc || !acc.distance) return objectiveObject;
        if (objectiveObject.distance < acc.distance) return objectiveObject;
        return acc;
    }, null as Objective & { distance: number } | null);
    
    return closestObjective;
}

