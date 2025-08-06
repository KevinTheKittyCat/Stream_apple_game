import { useGameStore } from "@/stores/GameState";
import { useCallback, useEffect, useState } from "react";

export default function Timer() {
    const { extraTime, time, timer, updateTimer } = useGameStore()
    //const [timer, setTimer] = useState(5);

    const minusTimer = useCallback(() => {
        updateTimer(-0.01); // Prevent negative timer
    }, []);

    useEffect(() => {
        if (timer <= 0) return; // Stop if timer is 0

        const interval = setInterval(minusTimer, 10);
        return () => clearInterval(interval); // Cleanup on unmount or timer change
    }, [minusTimer, timer]);

    return (
        <div className="score">
            <h1>Time: {timer.toFixed(2)}</h1>
        </div>
    );
}

// Edited by Kevin :D