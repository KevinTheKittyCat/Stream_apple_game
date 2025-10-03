import { Container, Flex } from "@chakra-ui/react";
import Score from "./Score";
import Timer from "../Timer";


export default function CurrentStatsMenu() {

    return (
        <Container variant={"normal"} minW={200}>
            <Timer />
            <Score />
            {/*<ApplesCounter />*/}
        </Container>
    );
}