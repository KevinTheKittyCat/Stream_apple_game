# Rope Physics Component

A physics-based rope component for PIXI.js React applications with realistic rope simulation and force application capabilities.

## Features

- **Realistic Physics**: Uses Verlet integration for smooth, stable rope simulation
- **Constraint Solving**: Multiple constraint iterations for rope stability
- **Force Application**: Apply forces to specific segments or endpoints
- **Customizable Parameters**: Adjust gravity, stiffness, segments, and more
- **Pin Points**: Pin start/end points or let them move freely
- **Visual Rendering**: Rope rendered with Graphics API showing segments and knots

## Basic Usage

```tsx
import MyRope from '@/components/Canvas/Rope';
import { useRef } from 'react';

function MyComponent() {
  const ropeRef = useRef();

  return (
    <MyRope
      ref={ropeRef}
      segments={15}
      gravity={980}
      stiffness={0.8}
      from={{ x: 100, y: 50 }}
      to={{ x: 300, y: 50 }}
      pinFrom={true}
      pinTo={false}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segments` | number | 10 | Number of rope segments |
| `segmentLength` | number | 50 | Length of each segment (currently unused but available for future features) |
| `gravity` | number | 980 | Gravity force in pixels per second squared |
| `stiffness` | number | 1 | Rope stiffness (0-1, where 1 is very stiff) |
| `constraintIterations` | number | 3 | Number of constraint solving iterations per frame |
| `from` | { x: number, y: number } | - | Starting position of the rope |
| `to` | { x: number, y: number } | undefined | Ending position (optional, creates hanging rope if omitted) |
| `pinFrom` | boolean | true | Whether to pin the start point |
| `pinTo` | boolean | false | Whether to pin the end point |

## Ref Methods

The rope component exposes several methods via ref for controlling the rope:

```tsx
const ropeRef = useRef();

// Apply force to the start of the rope
ropeRef.current.applyForceToStart(forceX, forceY);

// Apply force to the end of the rope
ropeRef.current.applyForceToEnd(forceX, forceY);

// Apply force to a specific segment
ropeRef.current.applyForceToSegment(segmentIndex, forceX, forceY);

// Pin/unpin the start point
ropeRef.current.pinStart();
ropeRef.current.unpinStart();

// Pin/unpin the end point
ropeRef.current.pinEnd();
ropeRef.current.unpinEnd();

// Set position of start/end points
ropeRef.current.setStartPosition(x, y);
ropeRef.current.setEndPosition(x, y);

// Get position of any particle
const position = ropeRef.current.getParticlePosition(index);
```

## Examples

### Hanging Rope
```tsx
<MyRope
  segments={20}
  gravity={800}
  from={{ x: 400, y: 50 }}
  pinFrom={true}
  pinTo={false}
/>
```

### Bridge/Cable
```tsx
<MyRope
  segments={25}
  gravity={600}
  stiffness={0.9}
  from={{ x: 100, y: 200 }}
  to={{ x: 500, y: 200 }}
  pinFrom={true}
  pinTo={true}
/>
```

### Interactive Rope with Forces
```tsx
function InteractiveRope() {
  const ropeRef = useRef();

  const applyWindForce = () => {
    ropeRef.current?.applyForceToEnd(500, -200);
  };

  return (
    <>
      <MyRope
        ref={ropeRef}
        segments={15}
        from={{ x: 200, y: 100 }}
        pinFrom={true}
      />
      <button onClick={applyWindForce}>Apply Wind</button>
    </>
  );
}
```

## Physics Parameters

- **Gravity**: Higher values make the rope fall faster
- **Stiffness**: Controls how rigid the rope is (0 = very flexible, 1 = rigid)
- **Constraint Iterations**: More iterations = more stable but more expensive
- **Segments**: More segments = smoother rope but more computation

## Performance Tips

1. Use fewer segments for distant or background ropes
2. Reduce constraint iterations if performance is critical
3. Consider using fewer segments for ropes that don't need high detail
4. Pin both ends for bridge-like ropes to reduce computation

## Visual Customization

The rope is currently rendered with:
- Brown rope segments (#8B4513)
- Darker brown knots at connection points (#654321)
- 4px line width with rounded caps

You can modify the visual appearance by editing the `RopeMesh` component's graphics drawing code.
