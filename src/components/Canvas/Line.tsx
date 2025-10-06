import type { Graphics } from 'pixi.js';

import { useMemo } from 'react';


const checkIfStraightLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    return from.x === to.x || from.y === to.y;
}

export default function Line({ from, to, stroke, alpha, ...props }: {
    from: { x: number; y: number };
    to: { x: number; y: number };
    stroke?: { color: string; width: number };
    alpha?: number;
}) {

    const draw = useMemo(() => (g: Graphics) => {
        const { x: x1, y: y1 } = from;
        const { x: x2, y: y2 } = to;
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const directionX = (x2 - x1) / distance;
        const directionY = (y2 - y1) / distance;

        const midX = (x1 + x2) / 2 + (checkIfStraightLine(from, to) ? 0 : 100 * directionY); // shift right for curvature
        const midY = (y1 + y2) / 2 + (checkIfStraightLine(from, to) ? 0 : 100 * directionX); // shift up for curvature
        const halfStrikeWidth = (stroke?.width || 1) / 2;

        g.clear();
        //g.rect(0, 0, window.innerWidth, window.innerHeight);
        //g.fill({ color: 0xffffff, alpha: 1 });
        g.moveTo((x1 || 0) + halfStrikeWidth, (y1 || 0) + halfStrikeWidth);
        //g.lineTo(x2 || 0, y2 || 0);
        g.quadraticCurveTo(midX + halfStrikeWidth, midY + halfStrikeWidth, x2 + halfStrikeWidth, y2 + halfStrikeWidth);
        g.stroke({
            width: stroke?.width || 1,
            color: stroke?.color || 0x000000,
            alpha: alpha || 1
        });
    }, [stroke, alpha, from, to]);

    return (
        <pixiGraphics draw={draw} {...props} />
    );
}