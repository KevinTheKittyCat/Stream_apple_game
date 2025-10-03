import { useGameStore } from "@/stores/GameState";
import "./styles/option-menu.css"
import TotalTime from "./TotalTime";
import LastScore from "./LastScore";
import { eventEmitter } from "@/utils/Eventemitter";
import { Button, Container, Flex } from "@chakra-ui/react";
import CalculateFinalResult from "./CalculateFinalResult";
import TalentsButton from "./TalentsButton";

export default function OptionMenu() {
    const { restartGame } = useGameStore()

    const goToStore = () => {
        eventEmitter.emit('changeRoute', { route: '/talentTree' });
    }

    return (
        <Flex className="option-menu" gap={2}>
            <Flex w={"80%"} justify={"space-between"}>
                <Container variant={"gold"} minW={"20%"}>
                    <CalculateFinalResult />
                </Container>
                <Container variant={"gold"} minW={"20%"}>
                    <LastScore />
                    <TotalTime />
                </Container>
            </Flex>
            <Flex width={"100%"} justify={"flex-start"} gap={2}>
                <Flex width={"50%"} justify={"flex-end"} gap={2}>
                    <TalentsButton />
                </Flex>
            </Flex>
            <Button variant={"menuButton"} onClick={restartGame} >Restart</Button>
        </Flex >
    );
}
