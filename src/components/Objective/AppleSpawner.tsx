
import { useEffect } from 'react';
import { useGameContext } from '../Contexts/GameContext';
import { useAppleSpawner } from './useAppleSpawner';

export default function AppleSpawner({
    limit = 10, // Limit the number of apples
}) {
    const { apples, setApples } = useGameContext();
    const { spawnApple, removeApple } = useAppleSpawner();
    const appleCount = apples.length;

    useEffect(() => {
        const interval = setInterval(() => {
            if (appleCount >= limit && limit !== 0) return; // Limit to 10 apples
            spawnApple();
        }, 200);
        return () => clearInterval(interval);
    }, [spawnApple]);

    useEffect(() => {
        // Clean up apples when the component unmounts
        return () => {
            setApples([]); // Clear apples on unmount
        };
    }, []);
    return { apples, setApples }; // This component does not render anything
}