import { useGameStore } from '@/stores/GameState';
import { useObjectivesStore, type Objective } from '@/stores/Objectives';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useWindowStore } from '@/stores/WindowState';
import { useTick } from '@pixi/react';
import { UPDATE_PRIORITY, type Sprite as PixiSprite } from 'pixi.js';
import {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef
} from 'react';
import { Sprite } from '../Canvas/Sprite';
import { checkHit } from '../Player/HitDetection';

export const Apple = memo(function Apple({ id }: Objective["id"]) {
    const { x = 100, y = 100, type, speed: fallingSpeed = 2 } = useObjectivesStore((state) => state.objectives.byId[id]);
    const { scale } = useWindowStore();
    const incrementScore = useGameStore((state) => state.incrementScore);
    const state = useGameStore((state) => state.state);
    //const { talents } = useTalentTreeStore();
    const { playerRef, getNewTarget, target } = usePlayerStore()
    const setAppleRef = useObjectivesStore((state) => state.setAppleRef);
    const removeApple = useObjectivesStore((state) => state.removeObjective);
    const spriteRef = useRef<PixiSprite | null>(null);
    const speedRef = useRef(0);

    const { scale: appleScale } = useMemo(() => ({
        scale: 1,
    }), []);

    const onHit = useCallback((apple: PixiSprite) => {
        //incrementScore(type)
        type?.onHit?.(apple);
        removeApple(id);
        if (target && target.ref === spriteRef) getNewTarget();
    }, [id, target, incrementScore, type, getNewTarget]);

    const checkHitWithPlayer = useCallback((currentApple: PixiSprite | null, playerRef: React.RefObject<PixiSprite | null> | null) => {
        if (!playerRef || !playerRef.current) return false;
        const hit = checkHit(currentApple, playerRef.current);
        return hit;
    }, []);

    const tickCallback = useCallback(function (this: React.RefObject<PixiSprite | null>, { deltaTime }) {
        const delta = deltaTime / 60;
        speedRef.current += (fallingSpeed - speedRef.current) * 0.1;

        if (!this.current) return;
        if (state === "gameOver") this.current.scale.set(
            Math.max(this.current.scale.x - 0.03 * delta * 60, 0),
            Math.max(this.current.scale.y - 0.03 * delta * 60, 0)
        );
        this.current.position.y += speedRef.current * delta * 60;

        if (this.current.position.y > window.innerHeight || this.current.scale.x <= 0) {
            if (target && target.ref === this) getNewTarget();
            return removeApple(id);
        }

        if (!playerRef && !this.current) return;
        const isHit = checkHitWithPlayer(this.current, playerRef);
        if (isHit) onHit(this.current);
    }, [fallingSpeed, state, target, getNewTarget, id, playerRef, checkHitWithPlayer, onHit]);

    useTick({
        callback: tickCallback,
        context: spriteRef,
        isEnabled: state !== 'paused',
        priority: UPDATE_PRIORITY.LOW,
    });

    useEffect(() => {
        if (!spriteRef) return;
        setAppleRef(id, spriteRef);
    }, [spriteRef, id, setAppleRef]);

    return (
        <Sprite
            ref={spriteRef}
            anchor={0.5}
            eventMode={'static'}
            texture={type.image}
            x={x}
            y={y}
            scale={appleScale}
            height={50 * scale}
        />
    );
});
