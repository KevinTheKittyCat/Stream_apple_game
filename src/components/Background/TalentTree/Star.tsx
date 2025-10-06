import Graphic from "@/components/Canvas/Graphic";
import { useTick } from "@pixi/react";
import { BlurFilter, Graphics as Pixigraphic, UPDATE_PRIORITY } from 'pixi.js';
import { useCallback, useMemo, useRef } from "react";

type StarProps = {
    position: { x: number; y: number };
    size?: number;
    animate?: boolean;
};


export default function Star({ position, size, animate = true, ...props }: StarProps) {
    const alphaRef = useRef(Math.random() * 0.6); // Initial alpha between 0 and 0.6
    const increasingRef = useRef(true);
    const startRef = useRef<Pixigraphic | null>(null);

    const filter = useMemo(() => new BlurFilter({
        strength: 8,      // Overall blur strength
        quality: 4,       // Blur quality (higher = better but slower)
        kernelSize: 5     // Size of blur kernel matrix
    }), []);

    const drawStar = useCallback((g: Pixigraphic | null, deltaTime: number) => {
        if (!g) return;
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
    }, [position, size, animate]);

    useTick({
        isEnabled: animate,
        priority: UPDATE_PRIORITY.LOW,
        context: startRef,
        callback(this: React.RefObject<Pixigraphic | null>, { deltaTime }) {
            drawStar(this.current, deltaTime);
        }
    });

    return (
        <Graphic
            ref={startRef}
            //drawFunction={drawStar}
            position={position}
            filters={filter}
            {...props}
        />
    );
}