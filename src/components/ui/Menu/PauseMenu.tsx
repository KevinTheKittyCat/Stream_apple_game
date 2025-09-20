import { useGameStore } from "@/stores/GameState";
import { Flex, Button } from "@chakra-ui/react";
import { useCallback } from "react";
import { LuSettings } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import "./styles/pause-menu.css"

export default function PauseMenu() {
    
    return (
        <Flex className="pause-menu">
            <PauseButton />
            <PauseMenuItems />
        </Flex>
    );
}

export function PauseMenuItems() {
    const { state, unpauseGame, setCurrentPage } = useGameStore();

    if (state !== "paused") return null;
    return (
        <Flex direction={"column"} className="pause-menu-items">
            <h1>Game Paused</h1>
            <p>The game is currently paused. Press the resume button to continue playing.</p>
            <Button onClick={() => setCurrentPage('talentTree')}>Upgrades / Store</Button>
            <Button onClick={() => {
                unpauseGame();
                // Logic to resume the game
            }}>Resume</Button>
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
        <Button className="pause-button" onClick={togglePause} >
            {state === "paused" ? <IoCloseOutline /> : <LuSettings size={24} />}
        </Button>
    );
}