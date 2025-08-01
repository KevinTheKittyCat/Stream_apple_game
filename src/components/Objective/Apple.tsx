import {
    Assets,
    Texture,
} from 'pixi.js';
import {
    use,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useTick } from '@pixi/react';
import { UPDATE_PRIORITY } from 'pixi.js'
import { Sprite } from '../Canvas/Sprite';
import { useGameContext } from '../Contexts/GameContext';

export function Apple() {
    const { setApples, apples } = useGameContext();
    // The Pixi.js `Sprite`
    const spriteRef = useRef(null)
    const [settings, setSettings] = useState({
        id: Math.random().toString(36).substring(2, 15),
    });

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

    useEffect(() => {
        if (!spriteRef.current) return;
        if (apples.some(apple => apple.id === settings.id)) return;
        setApples([...apples, {...settings, ref: spriteRef.current}]);
    }, [settings, apples, setApples]);


    return (
        <Sprite
            ref={spriteRef}
            anchor={0.5}
            eventMode={'static'}
            texture={"/assets/Apple.png"}
            x={100}
            y={100}
        />
    );
}
