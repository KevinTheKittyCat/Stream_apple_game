import useDelta from "@/hooks/useDelta";
import { useTick } from "@pixi/react";
import { UPDATE_PRIORITY, Sprite as PixiSprite } from "pixi.js";
import { useRef } from "react";

export default function useAutoMove({ enabled = true, x = 0, maxSpeed = 1 }) {
    const contextRef = useRef(null)
    const { getDelta } = useDelta()
    const velocityRef = useRef(0); // Current velocity (can be negative or positive)
    const xRef = useRef(x);

    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            if (!this.current || !enabled) return;
            
            const currentX = this.current.position.x;
            const targetX = x;
            const distance = targetX - currentX;

            // Update target reference
            if (xRef.current !== targetX) {
                xRef.current = targetX;
                // Don't recalculate velocity immediately - let it naturally adjust
            }

            // If we're close enough to the target, gradually slow down
            if (Math.abs(distance) < 0.5) {
                velocityRef.current *= 0.99; // Gradually slow down when close
                if (Math.abs(velocityRef.current) < 0.1) {
                    velocityRef.current = 0;
                    return;
                }
            } else {
                // Calculate desired velocity more smoothly
                const maxVelocity = maxSpeed * 2; // Reduced multiplier for smoother movement
                
                // Use a gentler approach to velocity calculation
                const normalizedDistance = Math.tanh(distance * 0.01); // Smooth sigmoid-like function
                const desiredVelocity = normalizedDistance * maxVelocity;
                
                // Very gentle easing towards desired velocity
                const easingFactor = 0.08; // Reduced easing for smoother transitions
                velocityRef.current += (desiredVelocity - velocityRef.current) * easingFactor;
            }

            if (!this.current) return;
            this.current.position.x += velocityRef.current * getDelta() * 60; // 60 = base frame rate
            /*
            // Calculate target speed based on direction and maxSpeed
            const targetSpeed = maxSpeed * direction;

            // Apply easing to the speed using delta time
            const easingFactor = 0.1;
            const deltaTime = getDelta();

            // Smoothly interpolate current speed towards target speed
            console.log(speedRef.current, (targetSpeed - speedRef.current) * easingFactor * deltaTime * 60)
            speedRef.current += (targetSpeed - speedRef.current) * easingFactor * deltaTime * 60;

            // Apply movement using delta time for frame-rate independent movement
            this.current.position.x += speedRef.current;
            */
        },
        context: contextRef,
        isEnabled: enabled,
        priority: UPDATE_PRIORITY.LOW,
    })

    return { ref: contextRef }
}