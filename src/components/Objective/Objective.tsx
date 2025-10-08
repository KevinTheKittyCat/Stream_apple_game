import { useObjectivesStore } from "@/stores/Objectives";




export default function Objective({ id }: { id: string }) {
    const objective = useObjectivesStore((state) => state.objectives.byId[id]);

    if (!objective) return null;
    return null;
}