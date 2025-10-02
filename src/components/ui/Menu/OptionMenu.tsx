import { useGameStore } from "@/stores/GameState";
import "./styles/option-menu.css"
import TotalTime from "./TotalTime";
import LastScore from "./LastScore";
import { eventEmitter } from "@/utils/Eventemitter";
import { Button, Container, Flex } from "@chakra-ui/react";
import CalculateFinalResult from "./CalculateFinalResult";

export default function OptionMenu() {
    const { restartGame } = useGameStore()

    const goToStore = () => {
        eventEmitter.emit('changeRoute', { route: '/talentTree' });
    }

    return (
        <Flex className="option-menu">
            <Flex w={"80%"} justify={"space-between"}>
                <Container variant={"gold"} minW={"20%"}>
                    <CalculateFinalResult />
                </Container>
                <Container variant={"gold"} minW={"20%"}>
                    <LastScore />
                    <TotalTime />
                </Container>
            </Flex>
            <Button variant={"menuButton"} onClick={goToStore}>Upgrades</Button>
            <Button variant={"menuButton"} onClick={restartGame} >Restart</Button>
        </Flex >
    );
}
