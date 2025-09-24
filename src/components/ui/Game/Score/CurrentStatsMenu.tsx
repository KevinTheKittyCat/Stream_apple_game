import { Flex } from "@chakra-ui/react";
import Score from "./Score";
import Timer from "../Timer";


export default function CurrentStatsMenu() {

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
            <Score />
            {/*<ApplesCounter />*/}
            <Timer />
        </Flex>
    );
}