import { useGameStore } from "@/stores/GameState";
import { Button, Container, Flex } from "@chakra-ui/react";
import CalculateFinalResult from "./CalculateFinalResult";
import LastScore from "./LastScore";
import Settings from "./Settings/Settings";
import "./styles/option-menu.css";
import TalentsButton from "./TalentsButton";
import TotalTime from "./TotalTime";

export default function OptionMenu() {
    const restartGame = useGameStore((state) => state.restartGame);

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
            <Flex width={"80%"} justify={"flex-start"} gap={2}>
                <Flex width={"50%"} justify={"flex-end"} gap={2}>
                    <TalentsButton />
                </Flex>
            </Flex>
            <Settings>
                <Button variant={"menuButton"} w={"100%"}>Settings</Button>
            </Settings>
            <Button variant={"menuButton"} onClick={restartGame}>Restart</Button>
        </Flex >
    );
}
