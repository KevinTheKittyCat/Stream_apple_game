import { useWindowStore } from '@/stores/WindowState';
import { extend, useTick } from '@pixi/react';
import {
    Container,
    Geometry,
    Mesh,
    Shader,
    Texture,
} from 'pixi.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';

extend({
    Container,
    Mesh,
});

// Perlin noise implementation in pure JavaScript
class PerlinNoise {
    private gradients: number[][][] = [];
    private memory: { [key: string]: number } = {};

    constructor() {
        this.generateGradients();
    }

    private generateGradients() {
        for (let i = 0; i < 256; i++) {
            this.gradients[i] = [];
            for (let j = 0; j < 256; j++) {
                const theta = Math.random() * 2 * Math.PI;
                this.gradients[i][j] = [Math.cos(theta), Math.sin(theta)];
            }
        }
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

    private grad(x: number, y: number, xf: number, yf: number): number {
        const gradient = this.gradients[x % 256][y % 256];
        return gradient[0] * xf + gradient[1] * yf;
    }

    noise(x: number, y: number): number {
        const key = `${x},${y}`;
        if (this.memory[key] !== undefined) {
            return this.memory[key];
        }

        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const u = this.fade(xf);
        const v = this.fade(yf);

        const n00 = this.grad(xi, yi, xf, yf);
        const n01 = this.grad(xi, yi + 1, xf, yf - 1);
        const n11 = this.grad(xi + 1, yi + 1, xf - 1, yf - 1);
        const n10 = this.grad(xi + 1, yi, xf - 1, yf);

        const x1 = this.lerp(v, n00, n01);
        const x2 = this.lerp(v, n10, n11);

        const result = this.lerp(u, x1, x2);
        this.memory[key] = result;
        return result;
    }

    // Octave noise for more complex patterns
    octaveNoise(x: number, y: number, octaves: number = 4, persistence: number = 0.5): number {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
    }
}

// Vertex shader (using your existing multipassMesh.vert structure)
const perlinVertex = `
precision mediump float;

attribute vec2 aPosition;
attribute vec2 aUV;

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;

varying vec2 vUvs;

void main() {
    vUvs = aUV;
    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
}
`;

// Fragment shader for Perlin noise generation
const perlinFragment = `
precision mediump float;
varying vec2 vUvs;
uniform float time;
uniform float scale;
uniform int octaves;
uniform float persistence;
uniform float lacunarity;
uniform vec2 offset;

// Simple hash function for noise generation
float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

// 2D hash
vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// Gradient noise function
float gradientNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Quintic interpolation
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    
    return mix(mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

// Fractal noise (multiple octaves)
float fractalNoise(vec2 p, int octaves, float persistence, float lacunarity) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float maxValue = 0.0;
    
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        value += gradientNoise(p * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    
    return value / maxValue;
}

void main() {
    vec2 coord = (vUvs + offset) * scale;
    
    float noise = fractalNoise(coord + time * 0.1, octaves, persistence, lacunarity);
    
    // Normalize to 0-1 range
    noise = (noise + 1.0) * 0.5;
    
    gl_FragColor = vec4(vec3(noise), 1.0);
}
`;

interface PerlinNoiseTextureProps {
    width?: number;
    height?: number;
    scale?: number;
    octaves?: number;
    persistence?: number;
    lacunarity?: number;
    animated?: boolean;
    method?: 'javascript' | 'shader';
    onTextureReady?: (texture: Texture) => void;
}

export const PerlinNoiseTexture: React.FC<PerlinNoiseTextureProps> = ({
    width = 512,
    height = 512,
    scale = 0.01,
    octaves = 4,
    persistence = 0.5,
    lacunarity = 2.0,
    animated = false,
    method = 'shader',
    onTextureReady,
}) => {
    const [time, setTime] = useState(0);
    const perlinRef = useRef<PerlinNoise | null>(null);

    // Initialize Perlin noise generator for JavaScript method
    useEffect(() => {
        if (method === 'javascript') {
            perlinRef.current = new PerlinNoise();
        }
    }, [method]);

    // Create geometry (matching your existing shader pattern)
    const geometry = useMemo(() => {
        return new Geometry({
            attributes: {
                aPosition: [
                    0, 0,           // x, y
                    width, 0,       // x, y
                    width, height,  // x, y,
                    0, height,      // x, y,
                ],
                aUV: [0, 0, 1, 0, 1, 1, 0, 1],
            },
            indexBuffer: [0, 1, 2, 0, 2, 3],
        });
    }, [width, height]);

    // Create shader for GPU method
    const shader = useMemo(() => {
        if (method !== 'shader') return null;

        return Shader.from({
            gl: {
                vertex: perlinVertex,
                fragment: perlinFragment,
            },
            resources: {
                perlinUniforms: {
                    time: { type: 'f32', value: 0 },
                    scale: { type: 'f32', value: scale },
                    octaves: { type: 'i32', value: octaves },
                    persistence: { type: 'f32', value: persistence },
                    lacunarity: { type: 'f32', value: lacunarity },
                    offset: { type: 'vec2', value: [0, 0] },
                },
            },
        });
    }, [method, scale, octaves, persistence, lacunarity]);

    // Generate texture using JavaScript method
    const generateJavaScriptTexture = () => {
        if (!perlinRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const noise = perlinRef.current.octaveNoise(
                    x * scale + time * 0.01,
                    y * scale + time * 0.01,
                    octaves,
                    persistence
                );
                
                // Normalize to 0-255 range
                const value = Math.floor((noise + 1) * 127.5);
                const index = (y * width + x) * 4;
                
                data[index] = value;     // R
                data[index + 1] = value; // G
                data[index + 2] = value; // B
                data[index + 3] = 255;   // A
            }
        }

        ctx.putImageData(imageData, 0, 0);

        // Create texture directly from canvas
        const newTexture = Texture.from(canvas);
        onTextureReady?.(newTexture);
    };

    // Generate JavaScript texture when parameters change
    useEffect(() => {
        if (method === 'javascript') {
            generateJavaScriptTexture();
        }
    }, [method, width, height, scale, octaves, persistence, time]);

    // Animation tick
    useTick((ticker) => {
        if (!animated) return;
        
        setTime(prev => prev + ticker.deltaTime * 0.01);
        
        if (method === 'shader' && shader) {
            shader.resources.perlinUniforms.uniforms.time = time;
        }
    });

    // Render shader method
    if (method === 'shader' && shader) {
        return (
            <pixiContainer>
                {/* @ts-ignore */}
                <pixiMesh geometry={geometry} shader={shader as any} />
            </pixiContainer>
        );
    }

    return null;
};

// Utility hook for creating Perlin noise textures
export const usePerlinNoiseTexture = (options: PerlinNoiseTextureProps) => {
    const [texture, setTexture] = useState<Texture | null>(null);

    return {
        texture,
        PerlinNoiseComponent: () => (
            <PerlinNoiseTexture
                {...options}
                onTextureReady={setTexture}
            />
        ),
    };
};

// Simplified example component
export const PerlinNoiseExamples: React.FC = () => {
    const { width, height } = useWindowStore() as { width: number; height: number };

    const examples = [
        {
            name: "Basic Noise",
            props: { scale: 0.05, octaves: 1, animated: false, method: 'shader' as const }
        },
        {
            name: "Fractal Noise", 
            props: { scale: 0.02, octaves: 6, persistence: 0.5, animated: false, method: 'shader' as const }
        },
        {
            name: "Animated Clouds",
            props: { scale: 0.01, octaves: 4, persistence: 0.6, lacunarity: 2.5, animated: true, method: 'shader' as const }
        },
    ];

    return (
        <pixiContainer>
            <PerlinNoiseTexture
                width={Math.min(width, 512)}
                height={Math.min(height, 512)}
                {...examples[0].props}
            />
        </pixiContainer>
    );
};

// Simple generator function for standalone use
export const generatePerlinNoiseTexture = async (options: PerlinNoiseTextureProps = {}): Promise<Texture> => {
    const {
        width = 512,
        height = 512,
        scale = 0.01,
        octaves = 4,
        persistence = 0.5,
    } = options;

    const perlin = new PerlinNoise();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const noise = perlin.octaveNoise(x * scale, y * scale, octaves, persistence);
            const value = Math.floor((noise + 1) * 127.5);
            const index = (y * width + x) * 4;
            
            data[index] = value;     // R
            data[index + 1] = value; // G
            data[index + 2] = value; // B
            data[index + 3] = 255;   // A
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return Texture.from(canvas);
};

export default PerlinNoiseTexture;
