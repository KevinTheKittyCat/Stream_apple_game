
import { useEffect } from 'react';
import { useAppleSpawner } from './useAppleSpawner';
import { useObjectivesStore } from '@/stores/Objectives';

export default function AppleSpawner({
    limit = 10, // Limit the number of apples
}) {
    const { apples, setApples } = useObjectivesStore();
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