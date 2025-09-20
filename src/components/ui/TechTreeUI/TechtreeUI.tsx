import { useGameStore } from "@/stores/GameState";
import { Button } from "@chakra-ui/react";
import Info from "./Info";




export default function TechtreeUI() {
    const { setCurrentPage, restartGame } = useGameStore();

    return (
        <div className="techtree-ui" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            padding: '10px',
        }}>
            <div className="techtree-ui-inner" style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
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
                    onClick={() => {
                        restartGame();
                        setCurrentPage('game');
                    }}>Back to Game</Button>
                {/* Render your tech tree UI components here */}
            </div>
        </div>
    );
}