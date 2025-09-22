import React, { useEffect, useState } from 'react';
import { extend } from '@pixi/react';
import { Container, Texture } from 'pixi.js';
import { Sprite } from '@/components/Canvas/Sprite';
import { useWindowStore } from '@/stores/WindowState';
import createPerlinNoiseTexture, { PerlinNoisePresets, createPerlinNoiseTextures } from '@/utils/PerlinNoiseGenerator';

extend({
    Container,
});

// Example 1: Basic usage - generate a single texture
export const BasicPerlinTextureExample = () => {
    const [texture, setTexture] = useState<Texture | null>(null);
    const { width, height } = useWindowStore() as { width: number; height: number };

    useEffect(() => {
        // Generate a new texture each time
        const newTexture = createPerlinNoiseTexture({
            width: 256,
            height: 256,
            scale: 0.02,
            octaves: 4,
            persistence: 0.5,
            seed: Math.random() * 1000, // Different seed each time
        });
        
        setTexture(newTexture);
    }, []);

    const generateNewTexture = () => {
        const newTexture = createPerlinNoiseTexture({
            width: 256,
            height: 256,
            scale: 0.02,
            octaves: 4,
            persistence: 0.5,
            seed: Math.random() * 1000, // New random seed
        });
        setTexture(newTexture);
    };

    return (
        <pixiContainer>
            {texture && (
                <>
                    <Sprite
                        texture={texture}
                        x={width / 2}
                        y={height / 2}
                        anchor={0.5}
                    />
                    {/* You can add UI here to trigger generateNewTexture */}
                </>
            )}
        </pixiContainer>
    );
};

// Example 2: Multiple textures with different parameters
export const MultipleTexturesExample = () => {
    const [textures, setTextures] = useState<Texture[]>([]);

    useEffect(() => {
        // Generate multiple textures at once
        const newTextures = createPerlinNoiseTextures(
            {
                width: 128,
                height: 128,
                scale: 0.02,
                octaves: 4,
                persistence: 0.5,
            },
            [
                { seed: 1, colorMode: 'grayscale' },
                { seed: 2, colorMode: 'red' },
                { seed: 3, colorMode: 'green' },
                { seed: 4, colorMode: 'blue' },
                { seed: 5, colorMode: 'custom', customColor: { r: 255, g: 165, b: 0 } }, // Orange
            ]
        );
        
        setTextures(newTextures);
    }, []);

    return (
        <pixiContainer>
            {textures.map((texture, index) => (
                <Sprite
                    key={index}
                    texture={texture}
                    x={index * 140 + 70}
                    y={100}
                    anchor={0.5}
                />
            ))}
        </pixiContainer>
    );
};

// Example 3: Using presets
export const PresetTexturesExample = () => {
    const [textures, setTextures] = useState<{ [key: string]: Texture }>({});

    useEffect(() => {
        // Generate textures using presets
        const cloudTexture = PerlinNoisePresets.clouds(200, 200, 123);
        const woodTexture = PerlinNoisePresets.wood(200, 200, 456);
        const marbleTexture = PerlinNoisePresets.marble(200, 200, 789);
        const fireTexture = PerlinNoisePresets.fire(200, 200, 101);
        const waterTexture = PerlinNoisePresets.water(200, 200, 202);

        setTextures({
            cloud: cloudTexture,
            wood: woodTexture,
            marble: marbleTexture,
            fire: fireTexture,
            water: waterTexture,
        });
    }, []);

    const presetNames = ['cloud', 'wood', 'marble', 'fire', 'water'];

    return (
        <pixiContainer>
            {presetNames.map((name, index) => (
                textures[name] && (
                    <Sprite
                        key={name}
                        texture={textures[name]}
                        x={(index % 3) * 220 + 110}
                        y={Math.floor(index / 3) * 220 + 110}
                        anchor={0.5}
                    />
                )
            ))}
        </pixiContainer>
    );
};

// Example 4: Dynamic texture generation with different scales
export const DynamicScaleExample = () => {
    const [currentTexture, setCurrentTexture] = useState<Texture | null>(null);
    const [currentScale, setCurrentScale] = useState(0.01);

    useEffect(() => {
        const texture = createPerlinNoiseTexture({
            width: 300,
            height: 300,
            scale: currentScale,
            octaves: 5,
            persistence: 0.6,
            seed: 42, // Fixed seed for consistent comparison
        });
        setCurrentTexture(texture);
    }, [currentScale]);

    // In a real app, you'd have UI controls to change the scale
    const changeScale = (newScale: number) => {
        setCurrentScale(newScale);
    };

    return (
        <pixiContainer>
            {currentTexture && (
                <Sprite
                    texture={currentTexture}
                    x={400}
                    y={300}
                    anchor={0.5}
                />
            )}
        </pixiContainer>
    );
};

// Example 5: Texture generation for different use cases
export const UseCaseExamples = () => {
    const [textures, setTextures] = useState<{ [key: string]: Texture }>({});

    useEffect(() => {
        // Generate textures for different use cases
        const backgroundNoise = createPerlinNoiseTexture({
            width: 800,
            height: 600,
            scale: 0.003,
            octaves: 6,
            persistence: 0.8,
            colorMode: 'custom',
            customColor: { r: 50, g: 50, b: 80, a: 100 }, // Dark blue with transparency
        });

        const terrainHeightMap = createPerlinNoiseTexture({
            width: 512,
            height: 512,
            scale: 0.01,
            octaves: 8,
            persistence: 0.4,
            colorMode: 'grayscale',
        });

        const cloudLayer = createPerlinNoiseTexture({
            width: 400,
            height: 400,
            scale: 0.005,
            octaves: 4,
            persistence: 0.7,
            colorMode: 'custom',
            customColor: { r: 255, g: 255, b: 255, a: 150 }, // Semi-transparent white
        });

        setTextures({
            background: backgroundNoise,
            terrain: terrainHeightMap,
            clouds: cloudLayer,
        });
    }, []);

    return (
        <pixiContainer>
            {/* Background layer */}
            {textures.background && (
                <Sprite
                    texture={textures.background}
                    x={0}
                    y={0}
                    alpha={0.3}
                />
            )}
            
            {/* Terrain */}
            {textures.terrain && (
                <Sprite
                    texture={textures.terrain}
                    x={100}
                    y={100}
                    scale={0.5}
                />
            )}
            
            {/* Clouds overlay */}
            {textures.clouds && (
                <Sprite
                    texture={textures.clouds}
                    x={200}
                    y={50}
                    alpha={0.6}
                />
            )}
        </pixiContainer>
    );
};

export default BasicPerlinTextureExample;
