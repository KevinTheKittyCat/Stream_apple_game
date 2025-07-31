import {
    Assets,
    Texture,
} from 'pixi.js';
import {
    use,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useApplication, useTick } from '@pixi/react';
import { UPDATE_PRIORITY } from 'pixi.js'
import { GameContext, useGameContext } from '../Contexts/GameContext';
import { Sprite } from '../Canvas/Sprite';



export function Player() {
    // The Pixi.js `Sprite`
    const spriteRef = useRef(null)
    //const { application, applicationRef } = useContext(GameContext);
    const { app, isInitialised } = useApplication();
    const [texture, setTexture] = useState(Texture.EMPTY)
    const [isActive, setIsActive] = useState(false)
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

    useTick({
        callback() {
            this.current.position.x = mouseCoords.x;
            this.current.rotation += 0.1
        },
        context: spriteRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.HIGH,
    })

    const handlePointerMove = useCallback((event) => {
        const { x, y } = event.data.global;
        setMouseCoords({ x, y });
    }, [setMouseCoords]);

    useEffect(() => {
        if (!isInitialised) return;
        app.stage.on('mousemove', handlePointerMove);

        return () => {
            console.log('Cleaning up pointer move listener');
            app.stage.off('mousemove', handlePointerMove);
        };
    }, [app, handlePointerMove]);

    return (
        <Sprite
            ref={spriteRef}
            anchor={0.5}
            eventMode={'dynamic'}
            onClick={(event) => setIsActive(!isActive)}
            scale={isActive ? 1 : 1.5}
            x={100}
            y={app.canvas.height - 100}
            texture={"https://pixijs.com/assets/bunny.png"}
        />
    );
}
