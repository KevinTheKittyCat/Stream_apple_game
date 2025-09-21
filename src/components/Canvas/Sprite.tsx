import {
    Assets,
    Texture,
    Sprite as PixiSprite,
} from 'pixi.js';

import {
    useEffect,
    useState,
    forwardRef,
    use,
    useCallback,
    useRef,
    useImperativeHandle,
    useMemo,
} from 'react';
import type { PixiReactElementProps } from '@pixi/react';

type Props = {
    texture?: string | Texture;
    size?: { width: number; height: number };
    width?: number;
    height?: number;
    id?: string;
} & Omit<PixiReactElementProps<typeof PixiSprite>, 'texture'>

export const Sprite = forwardRef<PixiSprite, Props>(function Sprite(
    {
        texture,
        size,
        width,
        height,
        id,
        ...props
    }: Props,
    ref
) {
    const [currentTexture, setCurrentTexture] = useState<Texture>(typeof texture === 'string' ? Texture.EMPTY : texture as Texture);

    const spriteSize = useMemo<{ width: number; height: number } | null>(() => {
        // TODO - SET UP MAX-WIDTH AND MAX-HEIGHT
        // TODO - SET UP MIN-WIDTH AND MIN-HEIGHT
        if (!currentTexture || currentTexture === Texture.EMPTY) return null;
        const texture = currentTexture;
        const { width: w, height: h } = size || { width: width ?? 0, height: height ?? 0 };
        const aspectRatio = texture.width / texture.height;

        if (w && !h) {
            const calculatedHeight = w / aspectRatio;
            return { width: w, height: calculatedHeight };
        }
        else if (!w && h) {
            const calculatedWidth = h * aspectRatio;
            return { width: calculatedWidth, height: h };
        }
        else if (w && h) {
            return { width: w, height: h };
        }
        return { width: texture.width, height: texture.height };
    }, [currentTexture, size, width, height]);

    // Preload the sprite if it hasn't been loaded yet
    useEffect(() => {
        if (currentTexture !== Texture.EMPTY && !texture) return;
        if (typeof texture === 'string') {
            Assets
                .load(texture)
                .then((result) => {
                    setCurrentTexture(result);
                });
        } else if (texture instanceof Texture) {
            setCurrentTexture(texture);
        }

    }, [texture, currentTexture, size, width, height]);

    if (
        !currentTexture
        || currentTexture === Texture.EMPTY
        || !spriteSize
    ) return null;

    return (
        <pixiSprite
            ref={ref}
            {...props}
            {...spriteSize}
            texture={currentTexture}
        />
    );
});