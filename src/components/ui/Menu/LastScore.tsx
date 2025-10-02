import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";
import { LuDollarSign } from "react-icons/lu";





export default function LastScore() {
    const { lastScore } = useGameStore();
    return (
        <Flex gap={2} align={"center"} className="score" style={{ fontSize: "1rem" }}>
            {/*<img src="/assets/apple/Apple.png" alt="Score Icon" style={{ width: "1em", height: "1em" }} />*/}
            <LuDollarSign />
            {/* Score display can be implemented here */}
            <h1>{lastScore}</h1>
        </Flex>
    );
}