import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";
import { RiCopperCoinLine } from "react-icons/ri";





export default function LastScore() {
    const lastScore = useGameStore((state) => state.lastScore);

    return (
        <Flex gap={2} align={"center"} className="score" style={{ fontSize: "1rem" }}>
            {/*<img src="/assets/apple/Apple.png" alt="Score Icon" style={{ width: "1em", height: "1em" }} />*/}
            <RiCopperCoinLine color="gold" />
            {/* Score display can be implemented here */}
            <h1>{lastScore?.total ?? 0}</h1>
        </Flex>
    );
}