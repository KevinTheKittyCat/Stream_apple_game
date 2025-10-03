import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

export default function Timer() {
    const { timer, updateTimer, startTime } = useGameStore()
    //const [timer, setTimer] = useState(5);

    const minusTimer = useCallback(() => {
        updateTimer(-0.01); // Prevent negative timer
    }, []);

    useEffect(() => {
        if (timer <= 0) return; // Stop if timer is 0
        // TODO: Make the timer use counter css instead of setInterval for better performance - if using numbers
        const interval = setInterval(minusTimer, 10);
        return () => clearInterval(interval); // Cleanup on unmount or timer change
    }, [minusTimer, timer]);

    return (
        <Flex gap={2} align={"center"} justify={"center"} className="score" style={{ fontSize: "1rem" }} w={"100%"}>
            <img src="/assets/Clock.png" alt="Score Icon" style={{ width: "1em", height: "1em" }} />
            <Flex w={"100%"} bg={"gray.200"} borderRadius={"md"} overflow={"hidden"} alignItems={"center"}>
                <Flex style={{ width: `${(timer / startTime) * 100}%`, height: "4px", background: "orange" }} borderRadius={"md"} />
            </Flex>
        </Flex>
    );
}

// Edited by Kevin :D