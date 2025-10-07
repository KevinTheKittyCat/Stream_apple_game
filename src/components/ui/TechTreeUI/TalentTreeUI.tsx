import { useGameStore } from "@/stores/GameState";
import { eventEmitter } from "@/utils/Eventemitter";
import { Button } from "@chakra-ui/react";
import UIWrapper from "../UIWrapper";
import Info from "./Info";
import TalentHint from "./TalentHint";



export default function TalentTreeUI() {
    const restartGame = useGameStore((state) => state.restartGame);
    const unpauseGame = useGameStore((state) => state.unpauseGame);

    const backToGame = () => {
        restartGame();
        unpauseGame();
        eventEmitter.emit('changeRoute', { route: '/' });
    }

    return (
        <UIWrapper>
            <Info />
            <Button style={{
                pointerEvents: 'auto',
                alignSelf: 'flex-start',
                position: 'absolute',
                fontSize: '28px',
                padding: '60px 100px',
                bottom: 20,
                right: 20,
            }}
                onClick={backToGame}>Back to Game</Button>
            {/* Render your tech tree UI components here */}
            <TalentHint />
        </UIWrapper>
    );
}