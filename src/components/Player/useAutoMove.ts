import useDelta from "@/hooks/useDelta";
import { useTick } from "@pixi/react";
import { UPDATE_PRIORITY, Sprite as PixiSprite } from "pixi.js";
import { useEffect, useRef } from "react";

type UseAutoMoveProps = {
    enabled?: boolean;
    targetPos: { x?: number | (() => number); y?: number | (() => number) };
    id?: string;
    maxVelocity?: number; // Maximum speed of the sprite
    normalizationFactor?: number; // Factor to normalize distance for smoother movement
    easingFactor?: number; // Easing factor for smoother movement
};

export default function useAutoMove({
    enabled = true,
    targetPos,
    id,
    maxVelocity = 2,
    normalizationFactor = 0.01, // Factor to normalize distance for smoother movement
    easingFactor = 0.1,
}: UseAutoMoveProps) {
    const contextRef = useRef<PixiSprite | null>(null)
    const velocityXRef = useRef(0); // Current velocity (can be negative or positive)
    const velocityYRef = useRef(0); // Current velocity for Y movement (if needed)
    const xRef = useRef(targetPos.x);
    const yRef = useRef(targetPos.y);


    useTick({
        callback(this: React.RefObject<PixiSprite | null>, { deltaTime }) {
            if (!this.current) return console.warn("useAutoMove: No sprite reference found");
            const { x, y } = targetPos;
            const targetX = typeof x === "function" ? x() : x;
            const targetY = typeof y === "function" ? y() : y;

            // Update target reference
            // Don't recalculate velocity immediately - let it naturally adjust
            if (xRef.current !== targetX) {
                xRef.current = targetX;

            }
            if (yRef.current !== targetY) {
                yRef.current = targetY;
            }

            if (!this.current) return;
            const delta = deltaTime / 60;

            if (isNumber(targetX)) this.current.position.x += calculateMovement({
                current: this.current.position.x,
                target: targetX,
                maxVelocity: maxVelocity,
                velocityRef: velocityXRef,
                delta: delta,
                normalizationFactor: normalizationFactor,
                easingFactor: easingFactor
            });
            if (isNumber(targetY)) this.current.position.y += calculateMovement({
                current: this.current.position.y,
                target: targetY,
                maxVelocity: maxVelocity,
                velocityRef: velocityYRef,
                delta: delta,
                normalizationFactor: normalizationFactor,
                easingFactor: easingFactor
            });
        },
        context: contextRef,
        isEnabled: enabled,
        priority: UPDATE_PRIORITY.LOW,
    })

    useEffect(() => {
        // Debugging
        if (!id) return;
        console.log("AutoMove enabled for", id, enabled);
    }, [id, enabled]);

    return { ref: contextRef }
}



const isNumber = (value: any) => {
    return typeof value === "number" && !isNaN(value) && typeof value !== "undefined";
}

const calculateMovement = ({
    current,
    target,
    maxVelocity = 2, // Default max speed
    delta,
    velocityRef,
    normalizationFactor = 0.01, // Factor to normalize distance for smoother movement
    easingFactor = 0.1, // Easing factor for smoother movement
}) => {
    const distance = target - current;
    //let velocity = 0;

    // If we're close enough to the target, gradually slow down

    // Calculate desired velocity more smoothly
    //const maxVelocity = maxSpeed * 2; // Reduced multiplier for smoother movement

    // Use a gentler approach to velocity calculation
    const normalizedDistance = Math.tanh(distance * normalizationFactor); // Smooth sigmoid-like function
    const desiredVelocity = normalizedDistance * maxVelocity;

    // Very gentle easing towards desired velocity
    velocityRef.current += (desiredVelocity - velocityRef.current) * easingFactor;


    return velocityRef.current * delta * 60; // 60 = base frame rate
}