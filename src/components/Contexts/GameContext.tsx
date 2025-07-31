import React, { createContext, use, useContext, useRef, useState, useEffect } from 'react';

export const GameContext = createContext(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [gameState, setGameState] = useState({
        score: 0
    });
    const [playerData, setPlayerData] = useState(null);
    const [isGameActive, setIsGameActive] = useState(false);

    return (
        <GameContext.Provider
            value={{
                gameState,
                setGameState,
                playerData,
                setPlayerData,
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








