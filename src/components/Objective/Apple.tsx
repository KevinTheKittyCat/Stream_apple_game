import { useGameStore } from '@/stores/GameState';
import { useObjectivesStore, type Objective } from '@/stores/Objectives';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useWindowStore } from '@/stores/WindowState';
import { useTalentTreeStore } from '@/stores/talentTreeState';
import { useTick } from '@pixi/react';
import { UPDATE_PRIORITY, type Sprite as PixiSprite } from 'pixi.js';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { Sprite } from '../Canvas/Sprite';
import { checkHit } from '../Player/HitDetection';
import { getTalentEffect } from '../UtilFunctions/talents';


export function Apple({ id, x = 100, y = 100, type, speed: fallingSpeed = 2 }: Objective) {
    const { scale } = useWindowStore();
    const { incrementScore, state } = useGameStore();
    const { talents } = useTalentTreeStore();
    const { playerRef, getNewTarget, target } = usePlayerStore()
    const { apples, setAppleRef, removeApple } = useObjectivesStore()
    const spriteRef = useRef<PixiSprite | null>(null);
    const speedRef = useRef(0); // current speed
    const { scale: appleScale } = useMemo(() => ({
        scale: getTalentEffect(1, "appleScale"),
    }), [talents]);

    const onHit = useCallback((apple: PixiSprite) => {
        incrementScore(type)
        type?.onHit?.(apple);
        removeApple(id);
        if (target && target.ref === spriteRef) getNewTarget();
    }, [id, removeApple, target, apples]);

    const checkHitWithPlayer = useCallback((currentApple: PixiSprite | null, playerRef: React.RefObject<PixiSprite | null> | null) => {
        if (!playerRef || !playerRef.current) return false;
        const hit = checkHit(currentApple, playerRef.current);
        return hit;
    }, [playerRef]);


    useTick({
        callback(this: React.RefObject<PixiSprite | null>, { deltaTime }) {
            //const now = performance.now();
            const delta = deltaTime / 60 //(now - lastTimeRef.current) / 1000; // seconds

            // Ease speed towards fallingSpeed
            speedRef.current += (fallingSpeed - speedRef.current) * 0.1; // 0.1 = easing factor

            if (!this.current) return;
            if (state === "gameOver") this.current.scale.set(
                Math.max(this.current.scale.x - 0.03 * delta * 60, 0),
                Math.max(this.current.scale.y - 0.03 * delta * 60, 0)
            );
            this.current.position.y += speedRef.current * delta * 60; // 60 = base frame rate

            if (this.current.position.y > window.innerHeight || this.current.scale.x <= 0) {
                if (target && target.ref === this) getNewTarget();
                return removeApple(id);
            }

            if (!playerRef && !this.current) return;
            const isHit = checkHitWithPlayer(this.current, playerRef);
            if (isHit) onHit(this.current);
        },
        context: spriteRef,
        isEnabled: state !== 'paused',
        priority: UPDATE_PRIORITY.LOW,
    })

    useEffect(() => {
        if (!spriteRef) return;
        if (apples.some(apple => apple.id === id && apple.ref)) return //console.warn("Apple ref already set for this id:", id);
        setAppleRef(id, spriteRef);
    }, [spriteRef, id]);


    return (
        <Sprite
            ref={spriteRef}
            anchor={0.5}
            eventMode={'static'}
            texture={type.image}
            x={x}
            y={y}
            scale={appleScale}
            //width={50 * scale}
            height={50 * scale}
        />
    );
}
