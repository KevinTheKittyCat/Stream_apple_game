import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoTimer } from "react-icons/io5";

export default function Timer() {
    const { timer, updateTimer, startTime } = useGameStore()
    //const [timer, setTimer] = useState(5);

    const minusTimer = useCallback(() => {
        updateTimer(-1); // Prevent negative timer
    }, []);

    useEffect(() => {
        if (timer <= 0) return; // Stop if timer is 0
        // TODO: Make the timer use counter css instead of setInterval for better performance - if using numbers
        const interval = setInterval(minusTimer, 1000);
        return () => clearInterval(interval); // Cleanup on unmount or timer change
    }, [minusTimer, timer]);

    const percentage = useMemo(() => (timer - 1) / (startTime - 1) * 100, [timer, startTime]);
    const backgroundColor = useMemo(() => {
        if (percentage > 50) return "limegreen";
        if (percentage > 20) return "orange";
        return "red";
    }, [percentage]);

    return (
        <Flex gap={2} align={"center"} justify={"center"} className="score" style={{ fontSize: "1rem" }} w={"100%"}>
            <img src="/assets/Clock.png" alt="Score Icon" style={{ width: "1em", height: "1em" }} />
            <Flex w={"100%"} bg={"gray.200"} borderRadius={"md"} overflow={"hidden"} alignItems={"center"}>
                <Flex style={{
                    width: `${percentage}%`, height: "8px",
                    background: backgroundColor,
                    transition: `width 1s linear, background ${backgroundColor === "limegreen" ? 0 : 0.5}s linear`,
                }} borderRadius={"md"}  />
            </Flex>
        </Flex>
    );
}

// Edited by Kevin :D