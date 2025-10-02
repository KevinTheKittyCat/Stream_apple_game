import { useGameStore } from "@/stores/GameState";
import "./styles/option-menu.css"
import TotalTime from "./TotalTime";
import LastScore from "./LastScore";
import { eventEmitter } from "@/utils/Eventemitter";
import { Button, Container } from "@chakra-ui/react";

export default function OptionMenu() {
    const { restartGame } = useGameStore()

    const goToStore = () => {
        eventEmitter.emit('changeRoute', { route: '/talentTree' });
    }

    return (
        <Container variant={"gold"} className="option-menu">
            <LastScore />
            <TotalTime />
            <Button variant={"menuButton"} onClick={goToStore}>Upgrades / Store</Button>
            <Button variant={"menuButton"} onClick={restartGame} >Restart</Button>
        </Container>
    );
}
