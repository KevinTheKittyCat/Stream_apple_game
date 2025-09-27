import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { useApplication } from '@pixi/react';
import { Sprite } from '../Canvas/Sprite';
import { Group } from '../Canvas/Group';
import Tophat from './Tophat';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useObjectivesStore } from '@/stores/Objectives';
import useAutoMove from './useAutoMove';
import Basket from './Basket';
import { useWindowStore } from '@/stores/WindowState';
import { useGameStore } from '@/stores/GameState';
import { useCanvasStore } from '@/stores/CanvasState';
import type { Sprite as PixiSprite } from 'pixi.js';
import { getTalentEffect, useTalentTreeStore } from '@/stores/talentTreeState';

export function Player() {
    const { scale } = useWindowStore();
    const { state } = useGameStore();
    const { talents } = useTalentTreeStore();
    const { apples } = useObjectivesStore();
    const { setPlayerRef, playerRef, target, getNewTarget, resetPlayer } = usePlayerStore()
    const spriteRef = useRef<PixiSprite>(null);
    const { app } = useApplication();
    const { mouseCoordsRef } = useCanvasStore();
    const movementSpeed = useMemo(() => getTalentEffect(4, "playerSpeed"), [getTalentEffect, talents]);


    const getTargetPositionX = useCallback(() => {
        if (mouseCoordsRef?.current?.x) {
            return mouseCoordsRef.current.x;
        }
        if (target && target.ref && target.ref.current) {
            return target.ref.current.x;
        }
        return window.innerWidth / 2;
    }, [target]);

    const getTargetPositionY = useCallback(() => {
        if (mouseCoordsRef?.current?.y) {
            return mouseCoordsRef.current.y;
        }
        if (target && target.ref && target.ref.current) {
            return target.ref.current.y;
        }
        return window.innerHeight / 2;
    }, [target]);

    const { ref } = useAutoMove({
        id: "player",
        enabled: state === 'playing',
        maxVelocity: movementSpeed,
        targetPos: {
            x: target?.ref?.current?.x ? getTargetPositionX : window.innerWidth / 2,
            y: target?.ref?.current?.y ? getTargetPositionY : window.innerHeight / 2
        },
        normalizationFactor: 0.01,
        easingFactor: 0.1,
    });

    useEffect(() => {
        if (!target || !target.ref || !target.ref.current) getNewTarget();
        const interval = setInterval(() => {
            if (!target || !target.ref || !target.ref.current) getNewTarget();
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, [apples, getNewTarget, target]);

    useEffect(() => {
        if (spriteRef?.current) ref.current = spriteRef.current
    }, [spriteRef]);

    useEffect(() => {
        if (!spriteRef?.current) return;
        setPlayerRef(spriteRef as React.RefObject<PixiSprite>);

        return () => {
            if (playerRef === spriteRef) setPlayerRef(null);
        };
    }, [spriteRef, playerRef, setPlayerRef]);

    const resetPosition = useCallback(() => {
        if (!app || !spriteRef.current) return;
        resetPlayer();
        //spriteRef.current.x = app.renderer.width / 2;
        //spriteRef.current.y = app.renderer.height * 0.90;
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
