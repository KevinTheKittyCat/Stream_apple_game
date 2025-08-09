import {
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';
import { useTick } from '@pixi/react';
import { type Sprite as PixiSprite, UPDATE_PRIORITY } from 'pixi.js'
import { Sprite } from '../Canvas/Sprite';
import { useAppleSpawner } from './useAppleSpawner';
import { checkHit } from '../Player/HitDetection';
import { useGameStore } from '@/stores/GameState';
import { useObjectivesStore } from '@/stores/Objectives';
import { usePlayerStore } from '@/stores/PlayerStore';

type AppleProps = {
    id: string;
    x?: number;
    y?: number;
    fallingSpeed?: number; // Speed at which the apple falls
};

export function Apple({ id, x = 100, y = 100, type }: AppleProps) {
    const { incrementScore } = useGameStore();
    const { playerRef, getNewTarget, target } = usePlayerStore()
    const { apples, setAppleRef, fallingSpeed } = useObjectivesStore()
    const spriteRef = useRef<PixiSprite | null>(null);
    const { removeApple } = useAppleSpawner();
    const speedRef = useRef(0); // current speed
    const lastTimeRef = useRef(performance.now());

    const onHit = useCallback((apple: PixiSprite) => {
        //console.log("Apple hit detected!");
        incrementScore(type.value)
        type?.onHit?.(apple);
        removeApple(id);
        //console.log("Apple removed:", target, target?.ref === spriteRef);
        if (target && target.ref === spriteRef) getNewTarget();
    }, [id, removeApple, target, apples]);

    const checkHitWithPlayer = useCallback((currentApple, playerRef) => {
        const hit = checkHit(currentApple, playerRef.current);
        return hit
    }, [playerRef]);

    // Use the `useTick` hook to animate the sprite
    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            const now = performance.now();
            const delta = (now - lastTimeRef.current) / 1000; // seconds
            lastTimeRef.current = now;

            // Ease speed towards fallingSpeed
            speedRef.current += (fallingSpeed - speedRef.current) * 0.1; // 0.1 = easing factor

            if (!this.current) return;
            this.current.position.y += speedRef.current * delta * 60; // 60 = base frame rate

            if (this.current.position.y > window.innerHeight) {
                this.current.position.y = 0;
                this.current.position.x = Math.random() * window.innerWidth;
                speedRef.current = 0; // reset speed for next fall
                if (target && target.ref === this) getNewTarget();
            }

            if (this.current.position.y < window.innerHeight / 2) return;

            if (!playerRef && !this.current) return;
            const isHit = checkHitWithPlayer(this.current, playerRef);
            if (isHit) onHit(this.current);
        },
        context: spriteRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.LOW,
    })

    useEffect(() => {
        if (!spriteRef.current) return;
        if (apples.some(apple => apple.id === id && apple.ref)) return //console.warn("Apple ref already set for this id:", id);
        setAppleRef(id, spriteRef);
    }, [apples, spriteRef]);


    return (
        <Sprite
            ref={spriteRef}
            anchor={0.5}
            eventMode={'static'}
            texture={type.image}
            x={x}
            y={y}
        />
    );
}
