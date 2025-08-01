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
import { CheckHitMultiple } from './HitDetection';



export function Player() {
    const { apples, setGameState } = useGameContext();
    const spriteRef = useRef(null)
    const { app, isInitialised } = useApplication();
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

    const checkHit = useCallback(() => {
        if (!spriteRef.current) return;
        const isHit = CheckHitMultiple(apples.map(apple => apple.ref), spriteRef.current, false, true);
        if (isHit) console.log("Hit detected!");
        if (isHit) setGameState((prevState) => ({ ...prevState, score: prevState.score + 1 }));

    }, [apples]);

    const handlePointerMove = useCallback((event: FederatedPointerEvent) => {
        const { x, y } = event.data.global;
        setMouseCoords({ x, y });
    }, [setMouseCoords]);

    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            if (!this.current) return;
            checkHit();
            this.current.position.x = mouseCoords.x;
            //this.current.rotation += 0.1
        },
        context: spriteRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.HIGH,
    })

    useEffect(() => {
        if (!isInitialised) return;
        app.stage.on('pointermove', handlePointerMove);

        return () => {
            console.log('Cleaning up pointer move listener');
            app.stage.off('pointermove', handlePointerMove);
        };
    }, [app, handlePointerMove]);




    return (
        <Group
            ref={spriteRef}
            x={100}
            y={app.canvas.height - 100}
        >
            <Sprite
                ref={spriteRef}
                anchor={0.5}
                eventMode={'dynamic'}
                texture={"https://pixijs.com/assets/bunny.png"}
            />
            <Tophat />
        </Group>
    );
}
