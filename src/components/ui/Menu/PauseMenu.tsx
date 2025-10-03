import { useGameStore } from "@/stores/GameState";
import { Flex, Button } from "@chakra-ui/react";
import { useCallback } from "react";
import { LuSettings } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import "./styles/pause-menu.css"
import { eventEmitter } from "@/utils/Eventemitter";
import TalentsButton from "./TalentsButton";
import Settings from "./Settings/Settings";

export default function PauseMenu() {

    return (
        <Flex className="pause-menu">
            <PauseButton />
            <PauseMenuItems />
        </Flex>
    );
}

export function PauseMenuItems() {
    const { state, unpauseGame, gameOver } = useGameStore();

    if (state !== "paused") return null;
    return (
        <Flex direction={"column"} gap={2} className="pause-menu-items">
            <h1>Game Paused</h1>
            <p>The game is currently paused. Press the resume button to continue playing.</p>
            <Button variant={"menuButton"} onClick={gameOver}>End Game // REMOVE IN PRODUCTION</Button>
            <TalentsButton />
            <Settings>
                <Button variant={"menuButton"} w={"100%"}>Settings</Button>
            </Settings>
            <Button variant={"menuButton"} onClick={unpauseGame}>Resume</Button>
        </Flex>
    );
}

export function PauseButton() {
    const { pauseGame, unpauseGame, state } = useGameStore();

    const togglePause = useCallback(() => {
        if (state === "paused") {
            unpauseGame();
        } else {
            pauseGame();
        }
    }, [pauseGame, unpauseGame, state]);

    if (state === "gameOver") return null;
    return (
        <Button variant={"iconButton"} top={0} right={0} pos={"absolute"} onClick={togglePause} >
            {state === "paused" ? <IoCloseOutline /> : <LuSettings size={24} />}
        </Button>
    );
}