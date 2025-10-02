import { Container, Flex } from "@chakra-ui/react";
import Score from "./Score";
import Timer from "../Timer";


export default function CurrentStatsMenu() {

    return (
        <Container variant={"gold"} minW={200}>
            <Score />
            {/*<ApplesCounter />*/}
            <Timer />
        </Container>
    );
}