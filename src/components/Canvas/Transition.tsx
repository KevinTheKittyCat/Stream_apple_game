
import vertex from '@/components/Canvas/Shaders/multipassMesh.vert?raw';
import noiseFragment from '@/components/Canvas/Shaders/noise.frag?raw';
import smoothNoiseFragment from '@/components/Canvas/Shaders/smoothNoise.frag?raw';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useWindowStore } from '@/stores/WindowState';
import { eventEmitter, type TransitionEvent } from '@/utils/Eventemitter';
import createPerlinNoiseTexture from '@/utils/PerlinNoiseGenerator';
import { extend, useTick } from '@pixi/react';
import { Assets, BlurFilter, Color, Container, Mesh, MeshGeometry, Shader, Texture, type BlurFilterOptions } from 'pixi.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
    animate?: boolean;
};

// TODO - ADD X-Y-Placement & Size options + Rename
// TODO - Animate color & alpha?

export default function Transition({
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
    speed = 0.01,
    limit = 0.5, // Initial limit value
    minLimit = 0,
    maxLimit = 1,
    // Careful with smooth. It is more expensive performance-wise.
    smooth = false,
    ...props
}: GalaxyProps) {
    const [perlinTexture, setPerlinTexture] = useState<Texture | null>(texture instanceof Texture ? texture : null);
    const currentLimitValue = useRef(0); // Should probably be a usememo or something. Oh well.
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

    const geometry = useMemo<MeshGeometry>(() => new MeshGeometry({
        positions: new Float32Array([
            0, 0,           // Bottom-left
            width, 0,       // Bottom-right  
            width, height,  // Top-right
            0, height       // Top-left
        ]),
        uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
        indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
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
                    limit: { type: 'f32', value: currentLimitValue.current },
                    customColor: { type: 'vec3<f32>', value: shaderColor }, //[0.05, 0.03, 0.03]
                    alpha: { type: 'f32', value: alpha },
                },
                noise: perlinTexture.source,
            },
        });
    }, [perlinTexture, shaderColor, vertex, smooth, noiseFragment, smoothNoiseFragment, alpha]);

    const loadTexture = useCallback(async (textureToApply: string | Texture) => {
        let texture = null;
        if (textureToApply instanceof Texture) texture = textureToApply
        if (typeof textureToApply === "string") texture = await Assets.load(textureToApply);
        setPerlinTexture(texture);
    }, []);

    useEffect(() => {
        if (texture) {
            loadTexture(texture);
            return;
        }
        const tx = createPerlinNoiseTexture(createTextureOptions);
        setPerlinTexture(tx);
    }, [texture, loadTexture]);

    const animationState = useRef<'waiting' | 'entering' | 'exiting'>('exiting');

    useEventEmitter("transition", (data: TransitionEvent) => {
        if (data?.dir === "in") animationState.current = "entering";
        if (data?.dir === "out") animationState.current = "exiting";
    });

    useTick(({ deltaTime }) => {
        if (!noiseShader) return
        if (animationState.current === "waiting") return;
        
        if (currentLimitValue.current < maxLimit && animationState.current === "exiting") {
            currentLimitValue.current += (speed * deltaTime);
            if (currentLimitValue.current > 0.4) noiseShader.resources.noiseUniforms.uniforms.alpha -= (0.02 * deltaTime)
        }
        if (currentLimitValue.current >= maxLimit && animationState.current === "exiting") {
            currentLimitValue.current = maxLimit;
            animationState.current = "waiting";
        }

        if (currentLimitValue.current > minLimit && animationState.current === "entering") {
            currentLimitValue.current -= (speed * deltaTime);
            noiseShader.resources.noiseUniforms.uniforms.alpha = 1
        }
        if (currentLimitValue.current <= minLimit && animationState.current === "entering") {
            currentLimitValue.current = minLimit;
            animationState.current = "waiting";
            eventEmitter.emit('transition', { ready: true });
        }
        // Update the shader uniform - animate the noise - based on light and dark values of the noise image
        noiseShader.resources.noiseUniforms.uniforms.limit = currentLimitValue.current;
    });

    if (!perlinTexture || !noiseShader) return null;
    return (
        <>
            {debug && <pixiSprite texture={perlinTexture} x={0} y={0} width={256} height={256} />}
            <pixiMesh geometry={geometry} shader={noiseShader as any} filters={filters} {...props} />
        </>
    )
}