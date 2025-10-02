
import { useEffect, useState } from 'react';
import { useObjectivesStore } from '@/stores/Objectives';
import { useTalentTreeStore } from '@/stores/talentTreeState';
import { useGameStore } from '@/stores/GameState';
import { getTalentEffect } from '../UtilFunctions/talents';

export default function AppleSpawner() {
    const { createApple, setApples, apples } = useObjectivesStore();
    const { talents } = useTalentTreeStore();
    const { state } = useGameStore();
    const [increaseInterval, setIncreaseInterval] = useState(0);
    //const spawnRate = 200

    useEffect(() => {
        if (state !== 'playing') return; // Only spawn apples when playing
        const interval = setInterval(createApple,
            getTalentEffect(200, "appleSpawnRate") - increaseInterval
        );
        return () => clearInterval(interval);
    }, [createApple, talents, state, increaseInterval]);
    /*
    useEffect(() => {
        if (state !== 'playing') return setIncreaseInterval(prev => 0);
        const interval = setInterval(() => {
            setIncreaseInterval((prev) => Math.min(prev + 1, spawnRate - 50));
        }, 1000);
        return () => clearInterval(interval);
    }, [state]);*/

    return { apples, setApples }; // This component does not render anything
}