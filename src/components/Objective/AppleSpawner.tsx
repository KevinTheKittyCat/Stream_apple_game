
import { useEffect } from 'react';
import { useObjectivesStore } from '@/stores/Objectives';

export default function AppleSpawner() {
    const { createApple, setApples, apples } = useObjectivesStore();

    useEffect(() => {
        console.log("Starting apple spawn interval");
        const interval = setInterval(createApple, 200);
        return () => clearInterval(interval);
    }, [createApple]);

    useEffect(() => {
        // Clean up apples when the component unmounts
        return () => {
            console.log("Clearing apples on unmount");
            setApples([]); // Clear apples on unmount
        };
    }, []);
    return { apples, setApples }; // This component does not render anything
}