import { useApplication } from "@pixi/react";
import { useMemo } from "react";
import { Rectangle, Graphics } from 'pixi.js';



export default function Graphic({ size, color, stroke, alpha, rounded, drawFunction, ...props }: {
    size?: { width: number; height: number };
    color?: string;
    stroke?: { color: string; width: number };
    alpha?: number;
    rounded?: number | { tl: number; tr: number; br: number; bl: number };
    drawFunction?: (g: Graphics) => void;
}) {
    const { app } = useApplication();
    const draw = useMemo(() => (g: Graphics) => {
        if (drawFunction) return drawFunction(g);
        g.clear();
        if (rounded) {
            if (typeof rounded === 'number') {
                g.roundRect(0, 0, size?.width || 0, size?.height || 0, rounded);
            } else {
                console.warn("Rounded corners with different radii for each corner are not yet implemented.");
                //g.roundRect(0, 0, size?.width || 0, size?.height || 0, rounded);
                // TODO - implement different radius for each corner
                // Probably with clipping masks
            }
        } else {
            g.rect(0, 0, size?.width || 0, size?.height || 0);
        }

        //g.stroke({ color: stroke?.color, alpha: alpha || 1, width: stroke?.width || 1 });
        g.fill({ color: color ?? "transparent", alpha: alpha || 1 });
        // image fill
    }, [app, size, color, stroke, alpha]);

    return (
        <pixiGraphics draw={draw} {...props} />
    );
}