import {
    Assets,
    Texture,
    Sprite as PixiSprite,
} from 'pixi.js';

import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from 'react';
import { useTick } from '@pixi/react';
import type { PixiReactElementProps } from '@pixi/react';

type Props = {
    texture?: string | Texture;
} & Omit<PixiReactElementProps<typeof PixiSprite>, 'texture'>

export const Sprite = forwardRef<any, Props>(function Sprite(
    { texture, ...props },
    ref
) {
    const [currentTexture, setCurrentTexture] = useState(Texture.EMPTY);

    // Preload the sprite if it hasn't been loaded yet
    useEffect(() => {
        if (currentTexture === Texture.EMPTY && texture) {
            if (typeof texture === 'string') {
                Assets
                    .load(texture)
                    .then((result) => {
                        setCurrentTexture(result);
                    });
            } else {
                setCurrentTexture(texture);
            }
        }
    }, [currentTexture, texture]);

    return (
        <pixiSprite
            ref={ref}
            {...props}
            texture={currentTexture}
        />
    );
});