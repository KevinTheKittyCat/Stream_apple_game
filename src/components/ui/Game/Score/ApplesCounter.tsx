import { useObjectivesStore } from "@/stores/Objectives";

export default function ApplesCounter() {
    const apples = useObjectivesStore((state) => state.objectives.ids);

    return (
        <div className="apples-counter">
            {/* Apples counter display can be implemented here */}
            <h1>Apples: {apples.length}</h1>
        </div>
    );
}