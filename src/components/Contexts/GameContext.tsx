import React, { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react';



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
    const gameState = useRef<gameStateType>({
        score: 0
    });
    const [isGameActive, setIsGameActive] = useState(false);
    const apples = useRef<GameContextType["apples"]>([]);
    const [player, setPlayer] = useState<GameContextType["player"]>({
        id: 'player1',
        x: 100,
        y: 100,
        ref: null, // This will hold the reference to the player sprite
    });
    
    const setGameState = useCallback((newState: Partial<gameStateType>) => {
        gameState.current = {
            ...gameState.current,
            ...newState,
        };
    }, []);

    const setApples = useCallback((newApples: any[] | Function) => {
        console.log("Setting apples:", newApples, apples.current);
        if (newApples instanceof Function) {
            console.log("Updating apples with function");
            apples.current = newApples(apples.current);
            return;
        }
        apples.current = newApples;
    }, []);

    const addApple = useCallback((apple: any) => {
        apples.current.push(apple);
    }, []);

    const removeApple = useCallback((id: string) => {
        console.log("Removing apple with id:", id, apples.current);
        apples.current = apples.current.filter(apple => apple.id !== id);
    }, []);

    const paginateScore = useCallback((score) => {
        score.current += score;
    }, []);

    const applesCurrent = useMemo(() => apples.current, [apples.current]);

    return (
        <GameContext.Provider
            value={{
                apples:applesCurrent,
                setApples:setApples,
                addApple,
                removeApple,
                gameState,
                score: gameState.current.score,
                setGameState,
                paginateScore,
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








