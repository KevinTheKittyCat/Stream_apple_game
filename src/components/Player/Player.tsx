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
        if (state === 'gameOver') return window.innerWidth / 2;
        if (mouseCoordsRef?.current?.x) {
            return mouseCoordsRef.current.x;
        }
        if (target && target.ref && target.ref.current) {
            return target.ref.current.x;
        }
        return window.innerWidth / 2;
    }, [target, state]);

    const getTargetPositionY = useCallback(() => {
        if (state === 'gameOver') return window.innerHeight * 0.9;
        if (mouseCoordsRef?.current?.y) {
            return mouseCoordsRef.current.y;
        }
        if (target && target.ref && target.ref.current) {
            return target.ref.current.y;
        }
        return window.innerHeight / 2;
    }, [target, state]);

    const { ref } = useAutoMove({
        id: "player",
        enabled: true,
        maxVelocity: movementSpeed,
        targetPos: {
            x: getTargetPositionX(),
            y: getTargetPositionY()
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
    }, [app, spriteRef]);

    useEffect(() => {
        // Move to middle of screen on first render
        if (!spriteRef.current) return;
        resetPosition();
    }, [spriteRef]);

    return (
        <Group
            ref={spriteRef}
            scale={scale}
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
