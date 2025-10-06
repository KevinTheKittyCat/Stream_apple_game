import { useApplication } from "@pixi/react";
import type { PixiReactElementProps } from "node_modules/@pixi/react/types/typedefs/PixiReactNode";
import { Graphics } from 'pixi.js';
import { forwardRef, useEffect, useMemo, useState } from "react";

type GraphicProps = {
    size ?: { width: number; height: number };
    color ?: string;
    stroke ?: { color: string; width: number };
    alpha ?: number;
    rounded ?: number | { tl: number; tr: number; br: number; bl: number };
    drawFunction ?: (g: Graphics) => void;
    autoSize ?: React.RefObject<any>; // Ref to a Pixi element to measure size from
    padding ?: number;
} & Omit<PixiReactElementProps, 'children'>

const Graphic = forwardRef<Graphics, GraphicProps>(function Graphic(
    { size, color, stroke, alpha, rounded, drawFunction, padding = 0, autoSize, ...props },
    ref
) {
    const { app } = useApplication();
    const [measuredSize, setMeasuredSize] = useState<{ width: number; height: number } | null>(null);

    // Measure children bounds when autoSize is enabled and size is not provided
    useEffect(() => {
        if (!autoSize?.current) return;
        const measureBounds = () => {
            const container = autoSize.current;
            const bounds = container.getLocalBounds();

            const newWidth = Math.max(bounds.width + (padding || 0), 1);
            const newHeight = Math.max(bounds.height + (padding || 0), 1);

            // Only update if size actually changed to prevent infinite loops
            setMeasuredSize(current => {
                if (!current || current.width !== newWidth || current.height !== newHeight) {
                    return { width: newWidth, height: newHeight };
                }
                return current;
            });
        }
        measureBounds();
    }, [autoSize, size, padding]); // Use contentKey instead of children

    const effectiveSize = size || measuredSize || { width: 0, height: 0 };

    const draw = useMemo(() => (g: Graphics) => {
        if (drawFunction) return drawFunction(g);
        g.clear();
        if (rounded) {
            if (typeof rounded === 'number') {
                g.roundRect(-padding, -padding, effectiveSize.width + padding, effectiveSize.height + padding, rounded);
            } else {
                console.warn("Rounded corners with different radii for each corner are not yet implemented.");
                //g.roundRect(0, 0, effectiveSize.width, effectiveSize.height, rounded);
                // TODO - implement different radius for each corner
                // Probably with clipping masks
            }
        } else {
            g.rect(0, 0, effectiveSize.width, effectiveSize.height);
        }

        if (stroke) g.stroke({ color: stroke?.color, alpha: alpha || 1, width: stroke?.width || 1 });
        g.fill({ color: color ?? "transparent", alpha: alpha || 1 });
        // image fill
    }, [app, effectiveSize, color, stroke, alpha, rounded, drawFunction]);

    return (
        <pixiGraphics ref={ref} draw={draw} {...props} />
    );
});

export default Graphic;