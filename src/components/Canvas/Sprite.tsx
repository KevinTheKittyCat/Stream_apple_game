import {
    Assets,
    Texture,
    Sprite as PixiSprite,
} from 'pixi.js';

import {
    useEffect,
    useState,
    forwardRef,
} from 'react';
import type { PixiReactElementProps } from '@pixi/react';

type Props = {
    texture?: string | Texture;
    size?: { width: number; height: number };
} & Omit<PixiReactElementProps<typeof PixiSprite>, 'texture'>

export const Sprite = forwardRef<any, Props>(function Sprite(
    { texture, size, ...props },
    ref
) {
    const [currentTexture, setCurrentTexture] = useState<Texture>(Texture.EMPTY);
    const [spriteSize, setSpriteSize] = useState<{ width: number; height: number } | null>(null);

    const scaleHeightOrWidth = (size: { width?: number; height?: number }, texture: Texture) => {
        if (!texture) return;
        // TODO - SET UP MAX-WIDTH AND MAX-HEIGHT
        setSpriteSize(() => {
            if (size.width && !size.height) {
                const aspectRatio = texture.width / texture.height;
                const calculatedHeight = size.width / aspectRatio;
                return { width: size.width, height: calculatedHeight };
            }
            else if (!size.width && size.height) {
                const aspectRatio = texture.width / texture.height;
                const calculatedWidth = size.height * aspectRatio;
                return { width: calculatedWidth, height: size.height };
            }
            else if (size.width && size.height) {
                return { width: size.width, height: size.height };
            }
        });
    }

    // Preload the sprite if it hasn't been loaded yet
    useEffect(() => {
        if (currentTexture !== Texture.EMPTY && !texture) return;
        if (typeof texture === 'string') {
            Assets
                .load(texture)
                .then((result) => {
                    setCurrentTexture(result);
                    scaleHeightOrWidth({
                        ...size,
                        width: props?.width || size?.width,
                        height: props?.height || size?.height
                    }, result);
                });
        } else if (texture instanceof Texture) {
            setCurrentTexture(texture);
            scaleHeightOrWidth({
                ...size,
                width: props?.width || size?.width,
                height: props?.height || size?.height
            }, texture);
        }

    }, [texture, currentTexture]);

    if (
        !currentTexture
        || currentTexture === Texture.EMPTY
        || (size && !spriteSize)
    ) return null;
    return (
        <pixiSprite
            ref={ref}
            {...props}
            {...spriteSize}
            texture={currentTexture}

        //width={size?.width ?? props.width}
        //height={size?.height ?? props.height}
        />
    );
});