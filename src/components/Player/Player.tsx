import {
    type Sprite as PixiSprite,
    FederatedPointerEvent,
} from 'pixi.js';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useApplication, useTick } from '@pixi/react';
import { UPDATE_PRIORITY } from 'pixi.js'
import { useGameContext } from '../Contexts/GameContext';
import { Sprite } from '../Canvas/Sprite';
import { Group } from '../Canvas/Group';
import Tophat from './Tophat';
import { checkHitMultipleWithId } from './HitDetection';
import { useAppleSpawner } from '../Objective/useAppleSpawner';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useObjectivesStore } from '@/stores/Objectives';

type MouseCoords = {
    x: number | null;
    y: number | null;
}


export function Player() {
    const { apples } = useObjectivesStore();
    const { player, setPlayerRef, playerRef } = usePlayerStore()
    const { removeApple } = useAppleSpawner();
    const spriteRef = useRef(null)
    const { app, isInitialised } = useApplication();
    const mouseCoordsRef = useRef<MouseCoords>({ x: null, y: null });

    const handlePointerMove = useCallback((event: FederatedPointerEvent) => {
        const { x, y } = event.data.global;
        mouseCoordsRef.current = { x, y };
    }, []);

    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            if (!this.current) return;
            this.current.position.x = mouseCoordsRef.current.x !== null ? mouseCoordsRef.current.x : app.canvas.width / 2;
            //checkHit();
            this.current.rotation += 0.1
        },
        context: spriteRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.LOW,
    })

    useEffect(() => {
        app.stage.on('pointermove', handlePointerMove);

        return () => {
            console.log('Cleaning up pointer move listener');
            app.stage.off('pointermove', handlePointerMove);
        };
    }, [app, handlePointerMove]);

    useEffect(() => {
        if (!spriteRef.current) return;
        if (playerRef) return
        setPlayerRef(spriteRef);
    }, [apples, spriteRef]);

    return (
        <Group
            ref={spriteRef}
            x={app.canvas.width / 2}
            y={app.canvas.height - 100}
            eventMode={'dynamic'}
        >
            <Sprite
                anchor={0.5}
                texture={"https://pixijs.com/assets/bunny.png"}
            />
            <Tophat />
        </Group>
    );
}
