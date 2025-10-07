import { basePath } from "@/config/constants";
import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import HTMLGalaxyBackground from "../TechTreeUI/HTMLGalaxyBackground";
export default function Timer() {
    const timer = useGameStore((state) => state.timer);
    const updateTimer = useGameStore((state) => state.updateTimer);
    const startTime = useGameStore((state) => state.startTime);
    const barRef = useRef<HTMLDivElement>(null);
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

    const bg = useMemo(() => {
        if (percentage > 50) return "galaxyBlue";
        if (percentage > 20) return "galaxyPurple";
        return "tomato";
    }, [percentage]);

    return (
        <Flex gap={2} align={"center"} justify={"center"} className="score" style={{ fontSize: "1rem" }} w={"100%"}>
            <img src={`${basePath}/assets/Clock.png`} alt="Score Icon" style={{ width: "1em", height: "1em" }} />
            <Flex w={"100%"} bg={"gray.200"} borderRadius={"md"} overflow={"hidden"} alignItems={"center"}>
                <Flex ref={barRef} style={{
                    width: `${percentage}%`, height: "8px",
                    background: backgroundColor,
                    transition: `width 1s linear, background ${backgroundColor === "limegreen" ? 0 : 0.5}s linear`,
                }} borderRadius={"md"}>
                    <HTMLGalaxyBackground container={barRef} bg={bg}
                        borderRadius={"md"}
                        transition={`background 1s linear`}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
}

// Edited by Kevin :D