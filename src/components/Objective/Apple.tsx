import {
    Assets,
    Texture,
} from 'pixi.js';
import {
    useEffect,
    useRef,
    useState,
} from 'react';
import { useTick } from '@pixi/react';
import { UPDATE_PRIORITY } from 'pixi.js'
import { Sprite } from '../Canvas/Sprite';

export function Apple() {
    // The Pixi.js `Sprite`
    const spriteRef = useRef(null)
    const [isHovered, setIsHover] = useState(false)
    const [isActive, setIsActive] = useState(false)


    // Use the `useTick` hook to animate the sprite
    useTick({
        callback() {
            this.current.position.y += 1;
            if (this.current.position.y > window.innerHeight) {
                this.current.position.y = 0;
                this.current.position.x = Math.random() * window.innerWidth;
            }
        },
        context: spriteRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.HIGH,
    })

    return (
        <Sprite
            ref={spriteRef}
            anchor={0.5}
            eventMode={'static'}
            onClick={(event) => setIsActive(!isActive)}
            onPointerOver={(event) => setIsHover(true)}
            onPointerOut={(event) => setIsHover(false)}
            scale={isActive ? 1 : 1.5}
            texture={"/assets/Apple.png"}
            x={100}
            y={100}
        />
    );
}
