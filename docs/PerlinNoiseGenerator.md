# Perlin Noise Texture Generator for Pixi.js

This utility allows you to generate Perlin noise textures that can be used with Pixi.js. You can create new textures on demand with different parameters.

## Basic Usage

```typescript
import createPerlinNoiseTexture from '@/utils/PerlinNoiseGenerator';
import { Sprite } from '@/components/Canvas/Sprite';

// Generate a new texture
const texture = createPerlinNoiseTexture({
    width: 256,
    height: 256,
    scale: 0.02,
    octaves: 4,
    persistence: 0.5,
});

// Use it with a Pixi.js Sprite
<Sprite texture={texture} x={100} y={100} />
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | number | required | Width of the generated texture |
| `height` | number | required | Height of the generated texture |
| `scale` | number | 0.01 | Controls the "zoom" of the noise (smaller = larger features) |
| `octaves` | number | 4 | Number of noise layers (more = more detail) |
| `persistence` | number | 0.5 | How much each octave contributes (0-1) |
| `lacunarity` | number | 2.0 | Frequency multiplier for each octave |
| `seed` | number | undefined | Seed for reproducible noise |
| `offsetX` | number | 0 | X offset for the noise sampling |
| `offsetY` | number | 0 | Y offset for the noise sampling |
| `invert` | boolean | false | Invert the noise values |
| `colorMode` | string | 'grayscale' | Color mode: 'grayscale', 'red', 'green', 'blue', 'custom' |
| `customColor` | object | {r:255,g:255,b:255,a:255} | Custom color when using 'custom' mode |

## Examples

### Generate Multiple Textures

```typescript
import { createPerlinNoiseTextures } from '@/utils/PerlinNoiseGenerator';

const textures = createPerlinNoiseTextures(
    {
        width: 128,
        height: 128,
        scale: 0.02,
        octaves: 4,
    },
    [
        { seed: 1, colorMode: 'grayscale' },
        { seed: 2, colorMode: 'red' },
        { seed: 3, colorMode: 'blue' },
    ]
);
```

### Using Presets

```typescript
import { PerlinNoisePresets } from '@/utils/PerlinNoiseGenerator';

// Generate different types of textures
const cloudTexture = PerlinNoisePresets.clouds(200, 200);
const woodTexture = PerlinNoisePresets.wood(200, 200);
const marbleTexture = PerlinNoisePresets.marble(200, 200);
const fireTexture = PerlinNoisePresets.fire(200, 200);
const waterTexture = PerlinNoisePresets.water(200, 200);
```

### Different Scale Effects

- **Small scale (0.001-0.01)**: Large, smooth features (good for clouds, terrain)
- **Medium scale (0.01-0.1)**: Medium features (good for textures)
- **Large scale (0.1-1.0)**: Fine, detailed noise (good for surface details)

### Color Modes

- **'grayscale'**: Standard grayscale noise
- **'red'**: Red channel only
- **'green'**: Green channel only  
- **'blue'**: Blue channel only
- **'custom'**: Use custom color with intensity

### Custom Colors

```typescript
const fireTexture = createPerlinNoiseTexture({
    width: 256,
    height: 256,
    scale: 0.03,
    colorMode: 'custom',
    customColor: { r: 255, g: 100, b: 0 }, // Orange
});
```

## Common Use Cases

1. **Background Textures**: Use large scale with low octaves for smooth backgrounds
2. **Cloud Layers**: Use small scale with high octaves and transparency
3. **Terrain Height Maps**: Use medium scale with many octaves for detail
4. **Surface Details**: Use large scale with few octaves for fine surface variation
5. **Animated Textures**: Generate new textures with time-based offsets

## Performance Notes

- Texture generation happens on the CPU, so larger textures take longer
- Use appropriate sizes for your needs (don't generate 4K textures if you only need 256x256)
- Consider caching textures if you're using the same parameters repeatedly
- The seed parameter allows you to reproduce the same noise pattern

## Integration with Existing Code

This utility works alongside your existing Pixi.js React components. You can use it anywhere you need a `Texture` object:

```typescript
// In a component
const [backgroundTexture, setBackgroundTexture] = useState<Texture | null>(null);

useEffect(() => {
    const texture = PerlinNoisePresets.clouds(800, 600);
    setBackgroundTexture(texture);
}, []);

return (
    <pixiContainer>
        {backgroundTexture && (
            <Sprite texture={backgroundTexture} x={0} y={0} alpha={0.5} />
        )}
        {/* Your other game elements */}
    </pixiContainer>
);
```
