import { useTick } from "@pixi/react";
import { UPDATE_PRIORITY, Sprite as PixiSprite, Sprite } from "pixi.js";
import { useEffect, useRef } from "react";
import { useApplication } from "@pixi/react";



export const useParallax = ({
    speed = 0.01,
    min = -window.innerWidth * 0.1,
    max = window.innerWidth * 0.1,
    direction = "horizontal", // "horizontal" or "vertical"
    offset = 0,
}: {
    speed?: number;
    min?: number;
    max?: number;
    direction?: "horizontal" | "vertical";
    offset?: number;
}) => {
    const parallaxRef = useRef<Sprite | null>(null);
    const backOrFourth = useRef(true);

    useEffect(() => {
        if (!parallaxRef.current) return;
        parallaxRef.current.x = offset;
    }, [parallaxRef]);

    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            // Update clouds position
            if (!this.current) return;
            //console.log("Parallax update", this.current.x, max, backOrFourth.current);
            if (this.current.x > min) backOrFourth.current = false;
            if (this.current.x < max) backOrFourth.current = true;

            if (backOrFourth.current) {
                this.current.x += speed;
            } else {
                this.current.x -= speed;
            }
        },
        context: parallaxRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.LOW,
    });

    return {
        ref: parallaxRef,
    };
}