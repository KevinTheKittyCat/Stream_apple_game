import {
    type Sprite as PixiSprite,
    FederatedPointerEvent,
} from 'pixi.js';
import {
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { useApplication, useTick } from '@pixi/react';
import { UPDATE_PRIORITY } from 'pixi.js'
import { Sprite } from '../Canvas/Sprite';
import { Group } from '../Canvas/Group';
import Tophat from './Tophat';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useObjectivesStore } from '@/stores/Objectives';
import useAutoMove from './useAutoMove';
import Basket from './Basket';
import { useWindowStore } from '@/stores/WindowState';
import { useGameStore } from '@/stores/GameState';

type MouseCoords = {
    x: number | null;
    y: number | null;
}

export function Player() {
    const { scale } = useWindowStore();
    const { state } = useGameStore();
    const { apples } = useObjectivesStore();
    const { setPlayerRef, playerRef, target, getNewTarget, movementSpeed } = usePlayerStore()
    const spriteRef = useRef(null)
    const { app } = useApplication();
    const mouseCoordsRef = useRef<MouseCoords>({ x: null, y: null });

    //console.log(target?.ref?.current?.x, target?.ref?.current?.y, target?.ref?.current);
    const getTargetPositionX = useCallback(() => {
        if (mouseCoordsRef.current.x !== null) {
            return mouseCoordsRef.current.x;
        }
        if (target && target.ref.current) {
            return target.ref.current.x;
        }
        return window.innerWidth / 2;
    }, [target]);

    const getTargetPositionY = useCallback(() => {
        if (mouseCoordsRef.current.y !== null) {
            return mouseCoordsRef.current.y;
        }
        if (target && target.ref.current) {
            return target.ref.current.y;
        }
        return window.innerHeight / 2;
    }, [target]);

    const { ref } = useAutoMove({
        enabled: state === 'playing',
        maxVelocity: movementSpeed * 2,
        targetPos: {
            x: target?.ref?.current?.x ? getTargetPositionX : window.innerWidth / 2,
            y: target?.ref?.current?.y ? getTargetPositionY : window.innerHeight / 2
        },
        normalizationFactor: 0.01,
        easingFactor: 0.1,
    });



    useEffect(() => {
        if (!target || !target.ref.current) getNewTarget();
        const interval = setInterval(() => {
            if (!target || !target.ref.current) getNewTarget();
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, [apples, getNewTarget, target]);


    useEffect(() => {
        if (spriteRef) ref.current = spriteRef.current
    })

    const handlePointerMove = useCallback((event: FederatedPointerEvent) => {
        const { x, y } = event.data.global;
        mouseCoordsRef.current = { x, y };
    }, []);

    const handlePointerLeave = useCallback(() => {
        mouseCoordsRef.current = { x: null, y: null };
    }, []);

    useEffect(() => {
        app.stage.on('pointermove', handlePointerMove);
        app.stage.on('pointerleave', handlePointerLeave);

        return () => {
            console.log('Cleaning up pointer move listener');
            app.stage.off('pointermove', handlePointerMove);
            app.stage.off('pointerleave', handlePointerLeave);
        };
    }, [app, handlePointerMove, handlePointerLeave]);

    useEffect(() => {
        if (!spriteRef.current) return;
        if (playerRef) return
        setPlayerRef(spriteRef);
    }, [apples, spriteRef]);

    const resetPosition = useCallback(() => {
        spriteRef.current.x = app.renderer.width / 2;
        spriteRef.current.y = app.renderer.height * 0.90;
    }, [app, spriteRef]);

    useEffect(() => {
        // Move to middle of screen on first render
        if (!spriteRef.current) return;
        resetPosition();
    }, [spriteRef]);
    
    useEffect(() => {
        if (state === 'gameOver') resetPosition();
    }, [state, resetPosition]);

    return (
        <Group
            ref={spriteRef}
            scale={scale}
            //x={app.canvas.width / 2}
            //y={app.canvas.height * 0.98 - spriteRef.current?.height || 0}
            eventMode={'dynamic'}
        >
            <Sprite
                anchor={0.5}
                texture={"https://pixijs.com/assets/bunny.png"}
            />
            <Basket />
        </Group>
    );
}
