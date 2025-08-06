import React, { createContext, useContext, useState } from 'react';



type gameStateType = {
    score: number;
}

export type GameContextType = {
    apples: any[];
    setApples: React.Dispatch<React.SetStateAction<any[] | []>>;
    gameState: gameStateType;
    setGameState: React.Dispatch<React.SetStateAction<gameStateType>>;
    isGameActive: boolean;
    setIsGameActive: React.Dispatch<React.SetStateAction<boolean>>;
    player: any;
    setPlayer: React.Dispatch<React.SetStateAction<any | null>>;
    // Add any other game-related state or functions here
};

export const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [gameState, setGameState] = useState<gameStateType>({
        score: 0
    });
    const [isGameActive, setIsGameActive] = useState(false);
    const [apples, setApples] = useState<GameContextType["apples"]>([]);
    const [player, setPlayer] = useState<GameContextType["player"]>({
        id: 'player1',
        x: 100,
        y: 100,
        ref: null, // This will hold the reference to the player sprite
    });
    

    return (
        <GameContext.Provider
            value={{
                apples:apples,
                setApples:setApples,
                gameState,
                setGameState,
                isGameActive,
                setIsGameActive,
                player,
                setPlayer,
            }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }

    return context;
}








