import PerlinNoiseTexture, {
    generatePerlinNoiseTexture,
    usePerlinNoiseTexture
} from '@/components/Canvas/PerlinNoiseTexture';
import { Sprite } from '@/components/Canvas/Sprite';
import { useWindowStore } from '@/stores/WindowState';
import { extend } from '@pixi/react';
import { Container, Sprite as PixiSprite, Texture } from 'pixi.js';
import React from 'react';

extend({
    Container,
    PixiSprite,
});

// Example 1: Basic usage with component
export const BasicPerlinExample = () => {
    return (
        <pixiContainer>
            <PerlinNoiseTexture
                width={256}
                height={256}
                scale={0.02}
                octaves={4}
                persistence={0.5}
                animated={true}
                method="shader"
            />
        </pixiContainer>
    );
};

// Example 2: Using the hook to get texture for use with sprites
export const PerlinSpriteExample = () => {
    const { width, height } = useWindowStore() as { width: number; height: number };
    
    const { texture, PerlinNoiseComponent } = usePerlinNoiseTexture({
        width: 512,
        height: 512,
        scale: 0.01,
        octaves: 6,
        persistence: 0.6,
        lacunarity: 2.0,
        animated: true,
        method: 'shader',
    });

    return (
        <pixiContainer>
            {/* This renders the noise texture off-screen */}
            <PerlinNoiseComponent />
            
            {/* Use the texture with a sprite */}
            {texture && (
                <Sprite
                    texture={texture}
                    x={width / 2}
                    y={height / 2}
                    anchor={0.5}
                    scale={0.8}
                />
            )}
        </pixiContainer>
    );
};

// Example 3: Different noise types showcase
export const NoiseTypesShowcase = () => {
    
    const examples = [
        {
            name: "Fine Detail",
            props: { scale: 0.05, octaves: 1, x: 0, y: 0 }
        },
        {
            name: "Fractal Noise",
            props: { scale: 0.02, octaves: 6, persistence: 0.5, x: 200, y: 0 }
        },
        {
            name: "Animated Clouds",
            props: { scale: 0.01, octaves: 4, persistence: 0.6, animated: true, x: 400, y: 0 }
        },
        {
            name: "JavaScript Method",
            props: { scale: 0.03, octaves: 3, method: 'javascript' as const, x: 0, y: 200 }
        }
    ];

    return (
        <pixiContainer>
            {examples.map((example, index) => (
                <pixiContainer key={index} x={example.props.x} y={example.props.y}>
                    <PerlinNoiseTexture
                        width={180}
                        height={180}
                        scale={example.props.scale}
                        octaves={example.props.octaves}
                        persistence={example.props.persistence}
                        animated={example.props.animated}
                        method={example.props.method}
                    />
                </pixiContainer>
            ))}
        </pixiContainer>
    );
};

// Example 4: Using generatePerlinNoiseTexture for async texture creation
export const AsyncPerlinExample = () => {
    const [texture, setTexture] = React.useState<Texture | null>(null);
    const { width, height } = useWindowStore() as { width: number; height: number };

    React.useEffect(() => {
        const loadTexture = async () => {
            try {
                const generatedTexture = await generatePerlinNoiseTexture({
                    width: 256,
                    height: 256,
                    scale: 0.02,
                    octaves: 5,
                    persistence: 0.4,
                });
                setTexture(generatedTexture);
            } catch (error) {
                console.error('Failed to generate Perlin noise texture:', error);
            }
        };

        loadTexture();
    }, []);

    return (
        <pixiContainer>
            {texture && (
                <Sprite
                    texture={texture}
                    x={width / 2}
                    y={height / 2}
                    anchor={0.5}
                />
            )}
        </pixiContainer>
    );
};

// Example 5: Cloud-like background
export const CloudBackgroundExample = () => {
    const { width, height } = useWindowStore() as { width: number; height: number };
    
    return (
        <pixiContainer>
            <PerlinNoiseTexture
                width={width}
                height={height}
                scale={0.005}
                octaves={6}
                persistence={0.7}
                lacunarity={2.2}
                animated={true}
                method="shader"
            />
        </pixiContainer>
    );
};

// Example 6: Terrain-like texture
export const TerrainExample = () => {
    return (
        <pixiContainer>
            <PerlinNoiseTexture
                width={512}
                height={512}
                scale={0.02}
                octaves={8}
                persistence={0.4}
                lacunarity={2.5}
                animated={false}
                method="shader"
            />
        </pixiContainer>
    );
};

export default BasicPerlinExample;
