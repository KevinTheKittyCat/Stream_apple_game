
import { Application, Assets, BlurFilter, colorToUniform, Container, Geometry, Mesh, RenderTexture, Shader, Color } from 'pixi.js';
import { useEffect, useMemo, useState } from 'react';
import combineFragment from '@/components/Canvas/Shaders/combine.frag?raw';
import vertex from '@/components/Canvas/Shaders/multipassMesh.vert?raw';
import noiseFragment from '@/components/Canvas/Shaders/noise.frag?raw';
import rippleFragment from '@/components/Canvas/Shaders/ripple.frag?raw';
import waveFragment from '@/components/Canvas/Shaders/wave.frag?raw';
import { extend, useTick } from '@pixi/react';
import { useWindowStore } from '@/stores/WindowState';
import createPerlinNoiseTexture from '@/utils/PerlinNoiseGenerator';

extend({
    Container,
    Mesh,
});

// Helper function to convert RGBA (0-255) to normalized values (0-1)
const rgbaToNormalized = (r: number, g: number, b: number, a: number = 255) => ({
    rgb: [
        Number((r / 255).toFixed(2)),
        Number((g / 255).toFixed(2)),
        Number((b / 255).toFixed(2))
    ] as [number, number, number],
    alpha: Number((a / 255).toFixed(2)) // Fix: normalize alpha too
});

export default function Galaxy() {
    const [perlinTexture, setPerlinTexture] = useState<PIXI.Texture | null>(null);
    const [limitValue, setLimitValue] = useState(0.5);
    const [direction, setDirection] = useState(1);
    const { width, height } = useWindowStore();

    // Define your min and max values
    const minLimit = 0.4;
    const maxLimit = 0.6;
    const speed = 0.0003;

    // Galaxy color and alpha settings (using 255-based RGBA)
    const galaxyRGBA = useMemo(() => {
        //rgbaToNormalized(178, 76, 255, 10)
        const color = new Color({ r: 178, g: 76, b: 255, a: 0 });
        //colorToUniform(178, 76, 255, 10)
        return color.toArray();
    }, []); // Purple with low alpha (60/255 ≈ 0.23)
    //console.log(galaxyRGBA );

    //color * galaxyColor, color * galaxyAlpha

    const geometry = new Geometry({
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
    });

    useEffect(() => {
        const tx = createPerlinNoiseTexture({
            width: 256,
            height: 256,
        });
        setPerlinTexture(tx);
        /*
        const loadTexture = async () => {
            const texture = await Assets.load('https://pixijs.com/assets/perlin.jpg');
            setPerlinTexture(texture);
        };
        loadTexture();*/
    }, []);


    const noiseShader = useMemo(() => {
        if (!perlinTexture) return null;
        return Shader.from({
            gl: {
                vertex,
                // Second effect. Generates a filtered noise.
                fragment: noiseFragment,

            },
            resources: {
                noiseUniforms: {
                    limit: { type: 'f32', value: 0.01 },
                    //color: { type: 'f32', value: galaxyRGBA },
                    galaxyColor: { type: 'vec3<f32>', value: galaxyRGBA },
                    galaxyAlpha: { type: 'f32', value: 0.5 },
                },
                noise: perlinTexture.source,
            },
        })
    }, [perlinTexture, galaxyRGBA]);

    useTick((ticker) => {
        if (noiseShader) {
            const { deltaTime } = ticker;

            // ORIGINAL:
            //noiseShader.resources.noiseUniforms.uniforms.limit = Math.sin(lastTime * 0.001) * 0.35 + 0.5;

            // Update the limit value based on direction
            setLimitValue(prevValue => {
                const newSpeed = speed; // Add some randomness to speed
                let newValue = prevValue + (direction * newSpeed * deltaTime);

                // Check if we've hit the boundaries and need to reverse direction
                if (newValue >= maxLimit) {
                    newValue = maxLimit;
                    setDirection(-1);
                } else if (newValue <= minLimit) {
                    newValue = minLimit;
                    setDirection(1);
                }


                // Update the shader uniform
                noiseShader.resources.noiseUniforms.uniforms.limit = newValue;

                return newValue;
            });
        }
    });

    const filter = useMemo(() => new BlurFilter({
        strength: 2,      // Overall blur strength
        quality: 4,       // Blur quality (higher = better but slower)
        kernelSize: 5     // Size of blur kernel matrix
    }), []);
    //const noiseQuad = new Mesh({ geometry: geometry, shader: noiseShader });
    //noiseQuad.shader.resources.noiseUniforms.uniforms.limit = Math.sin(time * 0.5) * 0.35 + 0.5;
    if (!perlinTexture || !noiseShader) return null;
    return (
        <>
            <pixiSprite texture={perlinTexture} x={0} y={0} width={256} height={256} />
            {/*
            <pixiMesh geometry={geometry} shader={noiseShader as any} />
            */}
            <pixiMesh geometry={geometry} shader={noiseShader as any} filters={[filter]} />
        </>
    )
}