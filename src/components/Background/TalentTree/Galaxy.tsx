
import { Assets, BlurFilter, Container, Geometry, Mesh, Shader, Color, type BlurFilterOptions, Texture } from 'pixi.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import vertex from '@/components/Canvas/Shaders/multipassMesh.vert?raw';
import noiseFragment from '@/components/Canvas/Shaders/noise.frag?raw';
import smoothNoiseFragment from '@/components/Canvas/Shaders/smoothNoise.frag?raw';
import { extend, useTick } from '@pixi/react';
import { useWindowStore } from '@/stores/WindowState';
import createPerlinNoiseTexture from '@/utils/PerlinNoiseGenerator';

extend({
    Container,
    Mesh,
});

type GalaxyProps = {
    debug?: boolean;

    // Texture
    texture?: string | Texture; // Noise texture //TODO: ADD TEXTURE OPTION - TO DIRECTLY APPLY A TEXTURE
    createTextureOptions?: { width: number; height: number }; // Options for creating a perlin noise texture if no texture is provided
    blurOptions?: BlurFilterOptions | false;
    color?: Color | { r: number; g: number; b: number } | string; // Galaxy color
    alpha?: number;

    // Animation
    speed?: number;
    limit?: number; // Initial limit value
    minLimit?: number;
    maxLimit?: number;
    smooth?: boolean;
};

// TODO - ADD X-Y-Placement & Size options + Rename
// TODO - Animate color & alpha?

export default function Galaxy({
    debug = false,

    // Texture
    texture, // Perlin Noise image
    createTextureOptions = { width: 256, height: 256 }, // Options for creating a perlin noise texture if no texture is provided
    blurOptions = {
        strength: 2,      // Overall blur strength
        quality: 4,       // Blur quality (higher = better but slower)
        kernelSize: 5,     // Size of blur kernel matrix
    },
    color = { r: 178, g: 76, b: 255 }, // Galaxy color
    alpha = 1,

    // Animation
    speed = 0.0003,
    limit = 0.5, // Initial limit value
    minLimit = 0.4,
    maxLimit = 0.6,
    // Careful with smooth. It is more expensive performance-wise.
    smooth = false,
    ...props
}: GalaxyProps) {
    const [perlinTexture, setPerlinTexture] = useState<Texture | null>(texture instanceof Texture ? texture : null);
    const limitValue = useRef(limit); // Should probably be a usememo or something. Oh well.
    const [direction, setDirection] = useState(1);
    const { width, height } = useWindowStore();

    // Galaxy color and alpha settings (using 255-based RGBA)
    const shaderColor = useMemo(() => {
        const col = color instanceof Color ? color : new Color(color);
        // Normalize the values to 0.0-1.0
        return col.toRgbArray().map(c => c / 255);
    }, []);

    const blurFilter = useMemo(() => {
        if (!blurOptions) return null;
        return new BlurFilter(blurOptions);
    }, [blurOptions]);
    const filters = useMemo(() => (blurFilter ? [blurFilter] : []), [blurFilter]);

    const geometry = useMemo<Geometry>(() => new Geometry({
        attributes: {
            aPosition: [
                0,
                0, // x, y
                width,
                0, // x, y
                width,
                height, // x, y,
                0,
                height, // x, y,
            ],
            aUV: [0, 0, 1, 0, 1, 1, 0, 1],
        },
        indexBuffer: [0, 1, 2, 0, 2, 3],
    }), [width, height]);

    const noiseShader = useMemo(() => {
        if (!perlinTexture) return null;
        return Shader.from({
            gl: {
                vertex,
                fragment: smooth ? smoothNoiseFragment : noiseFragment,
            },
            resources: {
                noiseUniforms: {
                    limit: { type: 'f32', value: limitValue.current },
                    customColor: { type: 'vec3<f32>', value: shaderColor }, //[0.05, 0.03, 0.03]
                    alpha: { type: 'f32', value: alpha },
                },
                noise: perlinTexture.source,
            },
        });
    }, [perlinTexture, shaderColor]);

    const loadTexture = useCallback(async (textureToApply: string | Texture) => {
        const texture = textureToApply instanceof Texture ? textureToApply : await Assets.load(textureToApply);
        setPerlinTexture(texture);
    }, []);

    useEffect(() => {
        if (texture) return loadTexture(texture);
        const tx = createPerlinNoiseTexture(createTextureOptions);
        setPerlinTexture(tx);
    }, [texture]);

    useTick(({ deltaTime }) => {
        if (!noiseShader) return

        limitValue.current += (direction * speed * deltaTime);
        if (limitValue.current >= maxLimit) {
            limitValue.current = maxLimit;
            setDirection(-1);
        } else if (limitValue.current <= minLimit) {
            limitValue.current = minLimit;
            setDirection(1);
        }
        // Update the shader uniform - animate the noise - based on light and dark values of the noise image
        noiseShader.resources.noiseUniforms.uniforms.limit = limitValue.current;
    });

    if (!perlinTexture || !noiseShader) return null;
    return (
        <>
            {debug && <pixiSprite texture={perlinTexture} x={0} y={0} width={256} height={256} />}
            <pixiMesh geometry={geometry} shader={noiseShader} filters={filters} {...props} />
        </>
    )
}