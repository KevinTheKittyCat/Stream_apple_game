import { Texture } from 'pixi.js';

// Perlin noise implementation for generating textures
class PerlinNoise {
    private gradients: number[][][] = [];
    private memory: { [key: string]: number } = {};

    constructor(seed?: number) {
        // Use seed for reproducible noise if provided
        if (seed !== undefined) {
            this.seedRandom(seed);
        }
        this.generateGradients();
    }

    private seedRandom(seed: number) {
        // Simple seeded random number generator
        let m = 0x80000000; // 2^31
        let a = 1103515245;
        let c = 12345;
        let state = seed;
        Math.random = () => {
            state = (a * state + c) % m;
            return state / (m - 1);
        };
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
    octaveNoise(x: number, y: number, octaves: number = 4, persistence: number = 0.5, lacunarity: number = 2.0): number {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }

        return total / maxValue;
    }
}

interface PerlinNoiseOptions {
    width: number;
    height: number;
    scale?: number;
    octaves?: number;
    persistence?: number;
    lacunarity?: number;
    seed?: number;
    offsetX?: number;
    offsetY?: number;
    invert?: boolean;
    colorMode?: 'grayscale' | 'red' | 'green' | 'blue' | 'custom';
    customColor?: { r: number; g: number; b: number; a?: number };
}

/**
 * Generates a new Perlin noise texture that can be used with Pixi.js
 * @param options Configuration options for the noise generation
 * @returns A new Pixi.js Texture containing the generated noise
 */
export function createPerlinNoiseTexture(options: PerlinNoiseOptions): Texture {
    const {
        width,
        height,
        scale = 0.01,
        octaves = 4,
        persistence = 0.5,
        lacunarity = 2.0,
        seed,
        offsetX = 0,
        offsetY = 0,
        invert = false,
        colorMode = 'grayscale',
        customColor = { r: 255, g: 255, b: 255, a: 255 }
    } = options;

    // Create Perlin noise generator
    const perlin = new PerlinNoise(seed);

    // Create canvas for pixel manipulation
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        throw new Error('Could not get canvas 2D context');
    }

    // Generate noise data
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Generate noise value
            let noise = perlin.octaveNoise(
                (x + offsetX) * scale, 
                (y + offsetY) * scale, 
                octaves, 
                persistence, 
                lacunarity
            );
            
            // Normalize to 0-1 range
            noise = (noise + 1) * 0.5;
            
            // Apply invert if requested
            if (invert) {
                noise = 1 - noise;
            }
            
            // Convert to 0-255 range
            const value = Math.floor(noise * 255);
            const index = (y * width + x) * 4;
            
            // Apply color mode
            switch (colorMode) {
                case 'grayscale':
                    data[index] = value;     // R
                    data[index + 1] = value; // G
                    data[index + 2] = value; // B
                    data[index + 3] = 255;   // A
                    break;
                case 'red':
                    data[index] = value;     // R
                    data[index + 1] = 0;     // G
                    data[index + 2] = 0;     // B
                    data[index + 3] = 255;   // A
                    break;
                case 'green':
                    data[index] = 0;         // R
                    data[index + 1] = value; // G
                    data[index + 2] = 0;     // B
                    data[index + 3] = 255;   // A
                    break;
                case 'blue':
                    data[index] = 0;         // R
                    data[index + 1] = 0;     // G
                    data[index + 2] = value; // B
                    data[index + 3] = 255;   // A
                    break;
                case 'custom':
                    const intensity = value / 255;
                    data[index] = Math.floor(customColor.r * intensity);         // R
                    data[index + 1] = Math.floor(customColor.g * intensity);     // G
                    data[index + 2] = Math.floor(customColor.b * intensity);     // B
                    data[index + 3] = customColor.a || 255;                      // A
                    break;
            }
        }
    }

    // Put the image data to canvas
    ctx.putImageData(imageData, 0, 0);

    // Create and return new Texture
    return Texture.from(canvas);
}

/**
 * Creates multiple noise textures with different parameters
 * Useful for creating texture atlases or variations
 */
export function createPerlinNoiseTextures(baseOptions: PerlinNoiseOptions, variations: Partial<PerlinNoiseOptions>[]): Texture[] {
    return variations.map(variation => 
        createPerlinNoiseTexture({ ...baseOptions, ...variation })
    );
}

/**
 * Utility functions for common noise patterns
 */
export const PerlinNoisePresets = {
    /**
     * Creates a cloud-like texture
     */
    clouds: (width: number, height: number, seed?: number): Texture => 
        createPerlinNoiseTexture({
            width,
            height,
            scale: 0.005,
            octaves: 6,
            persistence: 0.7,
            lacunarity: 2.2,
            seed,
            colorMode: 'grayscale'
        }),

    /**
     * Creates a wood grain-like texture
     */
    wood: (width: number, height: number, seed?: number): Texture =>
        createPerlinNoiseTexture({
            width,
            height,
            scale: 0.02,
            octaves: 4,
            persistence: 0.8,
            lacunarity: 2.0,
            seed,
            colorMode: 'custom',
            customColor: { r: 139, g: 69, b: 19 } // Brown
        }),

    /**
     * Creates a marble-like texture
     */
    marble: (width: number, height: number, seed?: number): Texture =>
        createPerlinNoiseTexture({
            width,
            height,
            scale: 0.01,
            octaves: 8,
            persistence: 0.4,
            lacunarity: 2.5,
            seed,
            colorMode: 'grayscale'
        }),

    /**
     * Creates a fire-like texture
     */
    fire: (width: number, height: number, seed?: number): Texture =>
        createPerlinNoiseTexture({
            width,
            height,
            scale: 0.03,
            octaves: 5,
            persistence: 0.6,
            lacunarity: 2.1,
            seed,
            colorMode: 'custom',
            customColor: { r: 255, g: 100, b: 0 } // Orange-red
        }),

    /**
     * Creates a water-like texture
     */
    water: (width: number, height: number, seed?: number): Texture =>
        createPerlinNoiseTexture({
            width,
            height,
            scale: 0.015,
            octaves: 3,
            persistence: 0.5,
            lacunarity: 2.0,
            seed,
            colorMode: 'custom',
            customColor: { r: 0, g: 100, b: 255 } // Blue
        }),

    /**
     * Creates a fine detail texture
     */
    detail: (width: number, height: number, seed?: number): Texture =>
        createPerlinNoiseTexture({
            width,
            height,
            scale: 0.1,
            octaves: 1,
            persistence: 1.0,
            lacunarity: 2.0,
            seed,
            colorMode: 'grayscale'
        }),
};

export default createPerlinNoiseTexture;
