import { useExtend } from "@pixi/react";
import { Container } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import MyRope from "./Rope";

export default function RopeDemo() {
    useExtend({ Container });
    
    const ropeRef = useRef<any>(null);
    const [fromPosition] = useState({ x: 100, y: 100 });
    const [toPosition, setToPosition] = useState({ x: 300, y: 100 });
    
    // Example of applying forces
    useEffect(() => {
        const interval = setInterval(() => {
            if (ropeRef.current) {
                // Apply a small random force to the end of the rope
                const forceX = (Math.random() - 0.5) * 1000;
                const forceY = (Math.random() - 0.5) * 500;
                ropeRef.current.applyForceToEnd(forceX, forceY);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Example of moving the anchor points
    useEffect(() => {
        const interval = setInterval(() => {
            setToPosition(() => ({
                x: 300 + Math.sin(Date.now() * 0.001) * 50,
                y: 100 + Math.cos(Date.now() * 0.001) * 30
            }));
        }, 16);

        return () => clearInterval(interval);
    }, []);

    const handleMouseClick = () => {
        if (ropeRef.current) {
            // Apply a strong upward force when clicked
            ropeRef.current.applyForceToEnd(0, -2000);
        }
    };

    return (
        <pixiContainer 
            eventMode="static" 
            onPointerDown={handleMouseClick}
            width={window.innerWidth}
            height={window.innerHeight}
        >
            <MyRope
                segments={15}
                gravity={1200}
                stiffness={0.8}
                constraintIterations={4}
                from={fromPosition}
                to={toPosition}
                pinFrom={true}
                pinTo={true}
            />
            
            {/* Example with a hanging rope */}
            <MyRope
                segments={20}
                gravity={0}
                stiffness={0.1}
                constraintIterations={3}
                from={{ x: 500, y: 50 }}
                to={toPosition}
                pinFrom={true}
                pinTo={false}
            />
            
            {/* A simple hanging rope to show pure gravity effect */}
            <MyRope
                segments={12}
                gravity={1200}
                stiffness={2}
                constraintIterations={2}
                from={{ x: 700, y: 100 }}
                pinFrom={true}
                pinTo={false}
            />
        </pixiContainer>
    );
}
