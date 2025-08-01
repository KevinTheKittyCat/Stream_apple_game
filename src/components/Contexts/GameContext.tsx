import React, { createContext, use, useContext, useRef, useState, useEffect } from 'react';



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
};

export const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [gameState, setGameState] = useState<gameStateType>({
        score: 0
    });
    const [isGameActive, setIsGameActive] = useState(false);
    const [apples, setApples] = useState<GameContextType["apples"]>([]);
    

    return (
        <GameContext.Provider
            value={{
                apples:apples,
                setApples:setApples,
                gameState,
                setGameState,
                isGameActive,
                setIsGameActive,
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








