import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";
import { RiCopperCoinLine } from "react-icons/ri";




export default function Score() {
    const { currency } = useGameStore();

    return (
        <Flex
            className="current-stats-menu"
            direction="column"
            p={2} backdropFilter="blur(10px)" bgColor="rgba(255, 255, 255, 0.1)"
            borderRadius="md"
            width={"fit-content"}
            minWidth="200px"
            border={"1px solid rgba(255, 255, 255, 0.2)"}
        >
            <Flex gap={2} align={"center"} className="score" style={{ fontSize: "1rem" }}>
                <RiCopperCoinLine color="gold" />
                {/*<img src="/assets/apple/Apple.png" alt="Score Icon" style={{ width: "1em", height: "1em" }} />*/}
                {/* Score display can be implemented here */}
                <h1>{currency}</h1>
            </Flex>
        </Flex>
    );
}