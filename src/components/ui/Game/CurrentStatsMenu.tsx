import { Container, Flex } from "@chakra-ui/react";
import Score from "./Score/Score";
import Timer from "./Timer";


export default function CurrentStatsMenu() {

    return (
        <Container variant={"normal"} minW={200}>
            <Score />
            <Timer />
            {/*<ApplesCounter />*/}
        </Container>
    );
}