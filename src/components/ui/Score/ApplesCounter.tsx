import { useGameContext } from "@/components/Contexts/GameContext";

export default function ApplesCounter() {
    const { apples } = useGameContext();

    return (
        <div className="apples-counter">
            {/* Apples counter display can be implemented here */}
            <h1>Apples: {apples.length}</h1>
        </div>
    );
}