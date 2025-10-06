import { useApplication } from "@pixi/react";
import { Graphics, type ContainerChild } from 'pixi.js';
import { useEffect, useMemo, useRef, useState } from "react";


type AdaptableGraphicProps = {
    children: React.ReactNode;
    size?: { width: number; height: number };
    color?: string;
    stroke?: { color: string; width: number };
    alpha?: number;
    rounded?: number | { tl: number; tr: number; br: number; bl: number };
    drawFunction?: (g: Graphics) => void;
    autoSize?: React.RefObject<any>; // Ref to a Pixi element to measure size from
    padding?: number;
    x?: number;
    y?: number;
    anchor?: { x: number; y: number };
} & Omit<Partial<ContainerChild>, 'children'>;


export default function AdaptableGraphic({
    children,
    size,
    color,
    stroke,
    alpha,
    rounded,
    drawFunction,
    padding = 0,
    autoSize,
    x,
    y,
    anchor,
    ...props }: AdaptableGraphicProps) {
    const { app } = useApplication();
    const containerRef = useRef<any>(null);
    const [measuredSize, setMeasuredSize] = useState<{ width: number; height: number } | null>(null);
    const effectiveSize = size || measuredSize || { width: 0, height: 0 };
    const anchorOffset = useMemo(() => anchor ? {
        x: anchor.x * (effectiveSize.width - padding * 2),
        y: anchor.y * (effectiveSize.height - padding * 2)
    } : { x: 0, y: 0 }, [measuredSize, anchor]);

    // Measure children bounds when autoSize is enabled and size is not provided
    useEffect(() => {
        if (!containerRef?.current) return;
        const measureBounds = () => {
            const container = containerRef.current;
            const bounds = container.getLocalBounds();

            const newWidth = Math.max(bounds.width, 1);
            const newHeight = Math.max(bounds.height, 1);

            // Only update if size actually changed to prevent infinite loops
            setMeasuredSize(current => {
                if (!current || current.width !== newWidth || current.height !== newHeight) {
                    return { width: newWidth, height: newHeight };
                }
                return current;
            });
        }
        measureBounds();
    }, [containerRef, size, padding]);

    const draw = useMemo(() => (g: Graphics) => {
        if (drawFunction) return drawFunction(g);
        g.clear();
        const width = effectiveSize.width + padding;
        const height = effectiveSize.height + padding;

        if (rounded) {
            if (typeof rounded === 'number') {
                g.roundRect(
                    anchor ? anchorOffset.x : 0,
                    anchor ? anchorOffset.y : 0,
                    width, height, rounded
                );
            } else {
                console.warn("Rounded corners with different radii for each corner are not yet implemented.");
                //g.roundRect(0, 0, effectiveSize.width, effectiveSize.height, rounded);
                // TODO - implement different radius for each corner
                // Probably with clipping masks
            }
        } else {
            g.rect(0, 0, width, height);
        }

        if (stroke) g.stroke({ color: stroke?.color, alpha: alpha || 1, width: stroke?.width || 1 });
        g.fill({ color: color ?? "transparent", alpha: alpha || 1 });
    }, [app, effectiveSize, color, stroke, alpha, rounded, drawFunction]);

    return (
        <pixiContainer ref={containerRef} x={x} y={y}>
            <pixiGraphics draw={draw} {...props} />
            <pixiContainer ref={containerRef}
                x={padding + anchorOffset.x}
                y={padding + anchorOffset.y}
            >
                {children}
            </pixiContainer>
        </pixiContainer>
    );
}