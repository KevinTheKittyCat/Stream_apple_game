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

type MouseCoords = {
    x: number | null;
    y: number | null;
}

export function Player() {
    const { apples } = useObjectivesStore();
    const { setPlayerRef, playerRef, target, getNewTarget, movementSpeed } = usePlayerStore()
    const spriteRef = useRef(null)
    const { app } = useApplication();
    const mouseCoordsRef = useRef<MouseCoords>({ x: null, y: null });
    const { ref } = useAutoMove({
        enabled: mouseCoordsRef.current.x === null,
        maxSpeed: movementSpeed,
        x: target?.ref?.current?.x || window.innerWidth / 2
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

    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            if (!this.current) return;
            //this.current.position.x = mouseCoordsRef.current.x !== null ? mouseCoordsRef.current.x : app.canvas.width / 2;
            //checkHit();
            //this.current.rotation += 0.1
            if (mouseCoordsRef.current.x !== null) this.current.position.x = mouseCoordsRef.current.x
        },
        context: spriteRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.LOW,
    })

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

    return (
        <Group
            ref={spriteRef}
            //x={app.canvas.width / 2}
            y={app.canvas.height * 0.98 - spriteRef.current?.height || 0}
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
