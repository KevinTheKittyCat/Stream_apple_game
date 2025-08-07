import { useApplication } from "@pixi/react";
import { useMemo } from "react";
import { Rectangle, Graphics } from 'pixi.js';



export default function Graphic({ size, color, stroke, alpha, ...props }: {
    size?: { width: number; height: number };
    color?: string;
    stroke?: { color: string; width: number };
    alpha?: number;
}) {
    const { app } = useApplication();
    const draw = useMemo(() => (g: Graphics) => {
        g.clear();
        g.rect(0, 0, size?.width || 0, size?.height || 0);
        //g.stroke({ color: stroke?.color, alpha: alpha || 1, width: stroke?.width || 1 });
        g.fill({ color: color, alpha: alpha || 1 });
    }, [app, size, color, stroke, alpha]);

    return (
        <pixiGraphics draw={draw} {...props} />
    );
}