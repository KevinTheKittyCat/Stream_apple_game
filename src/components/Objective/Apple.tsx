import {
    useEffect,
    useRef,
    useCallback,
} from 'react';
import { useTick } from '@pixi/react';
import { type Sprite as PixiSprite, UPDATE_PRIORITY } from 'pixi.js'
import { Sprite } from '../Canvas/Sprite';
import { checkHit } from '../Player/HitDetection';
import { useGameStore } from '@/stores/GameState';
import { useObjectivesStore } from '@/stores/Objectives';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useWindowStore } from '@/stores/WindowState';

type AppleProps = {
    id: string;
    x?: number;
    y?: number;
    fallingSpeed?: number; // Speed at which the apple falls
    type?: any;
};

export function Apple({ id, x = 100, y = 100, type }: AppleProps) {
    const { scale } = useWindowStore();
    const { incrementScore, state } = useGameStore();
    const { playerRef, getNewTarget, target } = usePlayerStore()
    const { apples, setAppleRef, fallingSpeed, removeApple } = useObjectivesStore()
    const spriteRef = useRef<PixiSprite | null>(null);
    const speedRef = useRef(0); // current speed

    const onHit = useCallback((apple: PixiSprite) => {
        //console.log("Apple hit detected!");
        incrementScore(type.value)
        type?.onHit?.(apple);
        removeApple(id);
        //console.log("Apple removed:", target, target?.ref === spriteRef);
        if (target && target.ref === spriteRef) getNewTarget();
    }, [id, removeApple, target, apples]);

    const checkHitWithPlayer = useCallback((currentApple, playerRef) => {
        if (!playerRef || !playerRef.current) return false;
        const hit = checkHit(currentApple, playerRef.current);
        return hit
    }, [playerRef]);


    useTick({
        callback(this: React.RefObject<PixiSprite | null>, { deltaTime }) {
            //const now = performance.now();
            const delta = deltaTime / 60 //(now - lastTimeRef.current) / 1000; // seconds


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

            if (!playerRef && !this.current) return;
            const isHit = checkHitWithPlayer(this.current, playerRef);
            if (isHit) onHit(this.current);
        },
        context: spriteRef,
        isEnabled: state === 'playing',
        priority: UPDATE_PRIORITY.LOW,
    })
    
    useEffect(() => {
        if (!spriteRef.current) return;
        if (apples.some(apple => apple.id === id && apple.ref)) return //console.warn("Apple ref already set for this id:", id);
        setAppleRef(id, spriteRef);
        return () => {
            setAppleRef(id, null);
        };
    }, [spriteRef, id, apples]);


    return (
        <Sprite
            ref={spriteRef}
            anchor={0.5}
            eventMode={'static'}
            texture={type.image}
            x={x}
            y={y}
            width={50 * scale}
            height={50 * scale}
        />
    );
}
