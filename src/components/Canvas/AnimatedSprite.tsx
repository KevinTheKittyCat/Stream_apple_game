import {
    Assets,
    AnimatedSprite as pixiAnimatedSpriteType,
    Texture
} from 'pixi.js';

import type { PixiReactElementProps } from '@pixi/react';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';

type Props = Omit<PixiReactElementProps<typeof pixiAnimatedSpriteType>, 'textures' | 'autoPlay' | 'animationSpeed'> & {
    textures: string[] | Texture[];
    size?: { width: number; height: number };
    width?: number;
    height?: number;
    id?: string;
    autoPlay?: boolean;
    animationSpeed?: number;
}

export const AnimatedSprite = forwardRef<pixiAnimatedSpriteType, Props>(function AnimatedSprite(
    {
        textures,
        size,
        width,
        height,
        id,
        autoPlay = true,
        animationSpeed = 0.2,
        ...props
    }: Props,
    ref
) {
    const [currentTexture, setCurrentTexture] = useState<Texture[]>([]);
    const animationRef = useRef<pixiAnimatedSpriteType>(null);

    // Forward the internal ref to the external ref
    useImperativeHandle(ref, () => animationRef.current!, []);



    const spriteSize = useMemo<{ width: number; height: number } | null>(() => {
        if (!currentTexture || currentTexture.length === 0) return null;
        const texture = currentTexture[0];
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
        if (currentTexture.length > 0 || !textures || textures.length === 0) return;
        Promise.all(textures.map(async (t) => await Assets.load(t)))
            .then((results) => {
                setCurrentTexture(results as Texture[]);
            });
    }, [textures, currentTexture, size, width, height]);

    useEffect(() => {
        if (animationRef.current && autoPlay) {
            animationRef.current.play();
        }
    }, [animationRef, autoPlay, currentTexture]);

    if (
        !currentTexture
        || currentTexture.length === 0
        || !spriteSize
    ) return null;

    
    return <pixiAnimatedSprite
        ref={animationRef}
        textures={currentTexture}
        autoPlay={autoPlay}
        animationSpeed={animationSpeed}
        {...props}
    />;
});