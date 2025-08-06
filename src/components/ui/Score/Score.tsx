
import { useGameStore } from "@/stores/GameState";





export default function Score() {
    const { score } = useGameStore();
    return (
        <div className="score">
            {/* Score display can be implemented here */}
            <h1>Score: {score}</h1>
        </div>
    );
}