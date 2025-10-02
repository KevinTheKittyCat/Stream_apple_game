import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

export default function Timer() {
    const { timer, updateTimer } = useGameStore()
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
        <Flex gap={2} align={"center"} className="score" style={{ fontSize: "1rem" }}>
            <img src="/assets/Clock.png" alt="Score Icon" style={{ width: "1em", height: "1em" }} />
            <h1>{timer.toFixed(2)}</h1>
        </Flex>
    );
}

// Edited by Kevin :D