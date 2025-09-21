import Graphic from "@/components/Canvas/Graphic";
import { useCallback, useMemo, useRef } from "react";
import { BlurFilter, UPDATE_PRIORITY } from 'pixi.js';
import { useTick } from "@pixi/react";


type StarProps = {
    position: { x: number; y: number };
    size?: number;
    animate?: boolean;
};


export default function Star({ position, size, animate = true, ...props }: StarProps) {
    const alphaRef = useRef(Math.random() * 0.6); // Initial alpha between 0 and 0.6
    const increasingRef = useRef(true);
    const startRef = useRef<PIXI.Graphics | null>(null);

    const filter = useMemo(() => new BlurFilter({
        strength: 8,      // Overall blur strength
        quality: 4,       // Blur quality (higher = better but slower)
        kernelSize: 5     // Size of blur kernel matrix
    }), []);

    const drawStar = useCallback((g: PIXI.Graphics, deltaTime: number) => {
        g.clear();
        const cx = 0;
        const cy = 0;
        const outerRadius = size || 25;
        const innerRadius = (size || 25) / 2;
        let x = cx;
        let y = cy;

        g.circle(x, y, innerRadius);
        g.fill({ color: "white", alpha: alphaRef.current + 0.1 });
        g.circle(x, y, outerRadius);
        g.fill({ color: "white", alpha: alphaRef.current });

        if (animate) {
            // Update alpha for twinkling effect
            const randomFactor = 0.5 + Math.random() * 0.5; // Random factor between 0.5 and 1
            const speed = 0.002 * (deltaTime || 1) * randomFactor; // Speed of twinkling
            if (increasingRef.current) {

                alphaRef.current += speed;
                if (alphaRef.current >= 0.7) {
                    alphaRef.current = 0.7;
                    increasingRef.current = false;
                }
            } else {
                alphaRef.current -= speed;
                if (alphaRef.current <= 0) {
                    alphaRef.current = 0;
                    increasingRef.current = true;
                }
            }
        }
        //g.filters = [filter];


        /*
        const spikes = 5;
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        g.beginFill(0xFFFF00); // Yellow color
        g.lineStyle(2, 0xFFA500);
        g.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            g.lineTo(x, y);
            rot += step;
        }
        g.lineTo(cx, cy - outerRadius);
        g.endFill();
        */
    }, [position, size, animate]);

    useTick({
        isEnabled: animate,
        priority: UPDATE_PRIORITY.LOW,
        context: startRef,
        callback(this: React.RefObject<PixiSprite | null>, { deltaTime }) {
            drawStar(this.current, deltaTime);
        }
    });

    return (
        <Graphic
            ref={startRef}
            drawFunction={drawStar}
            position={position}
            filters={filter}
            {...props}
        />
    );
}