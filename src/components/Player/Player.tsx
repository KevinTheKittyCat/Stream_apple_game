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



export function Player() {
    const { apples, setGameState, player, setPlayer } = useGameContext();
    const { removeApple } = useAppleSpawner();
    const spriteRef = useRef(null)
    const { app, isInitialised } = useApplication();
    const mouseCoordsRef = useRef({ x: 0, y: 0 });

    const handlePointerMove = useCallback((event: FederatedPointerEvent) => {
        const { x, y } = event.data.global;
        mouseCoordsRef.current = { x, y };
    }, []);

    /*const checkHit = useCallback(() => {
        if (!spriteRef.current) return;
        const isHit = checkHitMultipleWithId(apples, spriteRef.current, false, true);
        if (isHit) console.log("Hit detected!");
        if (isHit) setGameState((prevState) => ({ ...prevState, score: prevState.score + 1 }));
        if (isHit) isHit.forEach(a => removeApple(a.id));
    }, [apples]);*/

    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            if (!this.current) return;
            this.current.position.x = mouseCoordsRef.current.x;
            //checkHit();
            //this.current.rotation += 0.1
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
        if (player.ref) return
        setPlayer(old => ({
            ...old,
            ref: spriteRef.current,
        }));
    }, [apples, spriteRef]);

    return (
        <Group
            ref={spriteRef}
            x={100}
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
