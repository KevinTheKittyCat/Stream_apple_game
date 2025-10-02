import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";





export default function Score() {
    const { score } = useGameStore();
    
    return (
        <Flex gap={2} align={"center"} className="score" style={{ fontSize: "1rem" }}>
            <img src="/assets/apple/Apple.png" alt="Score Icon" style={{ width: "1em", height: "1em" }} />
            {/* Score display can be implemented here */}
            <h1>{score?.total ?? 0}</h1>
        </Flex>
    );
}