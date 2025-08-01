import { useGameContext } from "@/components/Contexts/GameContext";





export default function Score() {
    const { gameState } = useGameContext();
    const { score } = gameState;
    return (
        <div className="score">
            {/* Score display can be implemented here */}
            <h1>Score: {score}</h1>
        </div>
    );
}