
import { useEffect } from 'react';
import { useObjectivesStore } from '@/stores/Objectives';

export default function AppleSpawner() {
    const { createApple, setApples, apples } = useObjectivesStore();

    useEffect(() => {
        console.log("Starting apple spawn interval");
        const interval = setInterval(createApple, 200);
        return () => clearInterval(interval);
    }, [createApple]);
    
    return { apples, setApples }; // This component does not render anything
}