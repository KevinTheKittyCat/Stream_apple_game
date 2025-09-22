
import { Application, Assets, Container, Geometry, Mesh, RenderTexture, Shader } from 'pixi.js';
import { useEffect, useMemo, useState } from 'react';
import combineFragment from './combine.frag?raw';
import vertex from './multipassMesh.vert?raw';
import noiseFragment from './noise.frag?raw';
import rippleFragment from './ripple.frag?raw';
import waveFragment from './wave.frag?raw';
import { extend, useTick } from '@pixi/react';
import { useWindowStore } from '@/stores/WindowState';

extend({
    Container,
    Mesh,
});

export default function Test() {
    const [perlinTexture, setPerlinTexture] = useState<PIXI.Texture | null>(null);
    const [limitValue, setLimitValue] = useState(0.5);
    const [direction, setDirection] = useState(1);
    const { width, height } = useWindowStore();
    
    // Define your min and max values
    const minLimit = 0.4;
    const maxLimit = 0.6;
    const speed = 0.0005;


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
        const loadTexture = async () => {
            const texture = await Assets.load('https://pixijs.com/assets/perlin.jpg');
            setPerlinTexture(texture);
        };
        loadTexture();
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
                    limit: { type: 'f32', value: 0.5 },
                },
                noise: perlinTexture.source,
            },
        })
    }, [perlinTexture]);

    useTick((ticker) => {
        if (noiseShader) {
            const { deltaTime } = ticker;

            // ORIGINAL:
            //noiseShader.resources.noiseUniforms.uniforms.limit = Math.sin(lastTime * 0.001) * 0.35 + 0.5;
            
            // Update the limit value based on direction
            setLimitValue(prevValue => {
                const rd = Math.random();
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
    //const noiseQuad = new Mesh({ geometry: geometry, shader: noiseShader });
    //noiseQuad.shader.resources.noiseUniforms.uniforms.limit = Math.sin(time * 0.5) * 0.35 + 0.5;
    if (!perlinTexture) return null;
    return (
        <pixiContainer>
            <pixiMesh geometry={geometry} shader={noiseShader} />

        </pixiContainer>
    )
}