import useDelta from "@/hooks/useDelta";
import { useTick } from "@pixi/react";
import { UPDATE_PRIORITY, Sprite as PixiSprite } from "pixi.js";
import { useRef } from "react";

export default function useAutoMove({ enabled = true, x = 0, maxSpeed = 1 }) {
    const contextRef = useRef(null)
    const { getDelta } = useDelta()

    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            if (!this.current || !enabled) return;

            const currentX = this.current.position.x;
            const targetX = x;
            const distance = targetX - currentX;

            // If we're close enough to the target, don't move
            if (Math.abs(distance) < 0.5) return;

            // Calculate movement direction (normalized)
            const direction = distance > 0 ? 1 : -1;

            // Calculate movement amount, capped by maxSpeed
            const moveAmount = Math.min(Math.abs(distance), maxSpeed) * direction;

            //console.log("Current position:", currentX, "Target X:", targetX, "Move amount:", moveAmount);

            // Apply the movement
            this.current.position.x += moveAmount;
        },
        context: contextRef,
        isEnabled: enabled,
        priority: UPDATE_PRIORITY.LOW,
    })

    return { ref: contextRef }
}