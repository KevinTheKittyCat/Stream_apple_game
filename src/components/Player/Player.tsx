import { basePath } from "@/config/constants";
import { useCanvasStore } from '@/stores/CanvasState';
import { useGameStore } from '@/stores/GameState';
import { useObjectivesStore } from '@/stores/Objectives';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useTalentTreeStore } from '@/stores/talentTreeState';
import { useWindowStore } from '@/stores/WindowState';
import { useApplication } from '@pixi/react';
import type { Sprite as PixiSprite } from 'pixi.js';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { Group } from '../Canvas/Group';
import { Sprite } from '../Canvas/Sprite';
import { getTalentEffect } from '../UtilFunctions/talents';
import { applyEffects } from "../UtilFunctions/talents/getEffects";
import Basket from './Basket';
import useAutoMove from './useAutoMove';

export function Player() {
    const { scale } = useWindowStore();
    const { state } = useGameStore();
    const { talents, talentsDict } = useTalentTreeStore();
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
    }, [target, state, talentsDict]);

    const getTargetPositionY = useCallback(() => {
        if (state === 'gameOver' || !applyEffects(0, "playerYAxis")) return window.innerHeight * 0.9;
        if (mouseCoordsRef?.current?.y) {
            return mouseCoordsRef.current.y;
        }
        if (target && target.ref && target.ref.current) {
            return target.ref.current.y;
        }
        return window.innerHeight / 2;
    }, [target, state, talentsDict]);

    const { ref } = useAutoMove({
        id: "player",
        enabled: state !== 'paused',
        maxVelocity: movementSpeed,
        targetPos: {
            x: getTargetPositionX,
            y: getTargetPositionY
        },
        normalizationFactor: 0.01,
        easingFactor: 0.5,
    });

    useEffect(() => {
        //if (!target || !target.ref || !target.ref.current) getNewTarget();
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

    const scaleAndAnchor = useMemo(() => {
        const scale = 0.8;
        return {
            scale: scale,
            anchor: { x: 0.5, y: 1.1 }
        };
    }, []);

    return (
        <Group
            ref={spriteRef}
            scale={scale}
            eventMode={'dynamic'}
        >
            <Sprite
                scale={scaleAndAnchor.scale}
                anchor={scaleAndAnchor.anchor}
                texture={`${basePath}/assets/basket/hand/Under_basket.png`}
            />
            <Basket />
            <Sprite
                scale={scaleAndAnchor.scale}
                anchor={scaleAndAnchor.anchor}
                texture={`${basePath}/assets/basket/hand/Over_basket.png`}
            />
        </Group>
    );
}
