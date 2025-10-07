import { basePath } from "@/config/constants";
import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";

export default function TotalTime() {
    const totalTime = useGameStore((state) => state.totalTime);
    //const [timer, setTimer] = useState(5);
    //const timeSpent = useMemo(() => (new Date() - time) / 1000, [time])

    return (
        <Flex gap={2} align={"center"} className="score" style={{ fontSize: "1rem" }}>
            <img src={`${basePath}/assets/Clock.png`} alt="Score Icon" style={{ width: "1em", height: "1em" }} />
            <h1>{String(totalTime.toFixed(2)).padStart(5, "0")}</h1>
        </Flex>
    );
}

// Edited by Kevin :D