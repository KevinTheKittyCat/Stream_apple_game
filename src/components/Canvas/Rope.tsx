import { useExtend, useTick } from "@pixi/react";
import { Point, Container, Graphics } from "pixi.js";
import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";
import { handlePositionIfRef } from "../UtilFunctions/RefHandling";

// Physics particle for rope simulation
class RopeParticle {
    x: number;
    y: number;
    oldX: number;
    oldY: number;
    pinned: boolean;
    mass: number;

    constructor(x: number, y: number, pinned: boolean = false, mass: number = 1) {
        this.x = x;
        this.y = y;
        this.oldX = x;
        this.oldY = y;
        this.pinned = pinned;
        this.mass = mass;
    }

    update(_deltaTime: number) {
        if (this.pinned) return;

        // Verlet integration with damping
        const damping = 0.995; // Air resistance
        const velocityX = (this.x - this.oldX) * damping;
        const velocityY = (this.y - this.oldY) * damping;

        this.oldX = this.x;
        this.oldY = this.y;

        this.x += velocityX;
        this.y += velocityY;
    }

    applyForce(forceX: number, forceY: number, deltaTime: number) {
        if (this.pinned) return;

        // Apply force as acceleration (F = ma, so a = F/m)
        const accelerationX = forceX / this.mass;
        const accelerationY = forceY / this.mass;

        // Integrate acceleration into position using Verlet integration
        this.x += accelerationX * deltaTime * deltaTime;
        this.y += accelerationY * deltaTime * deltaTime;
    }

    pin() {
        this.pinned = true;
    }

    unpin() {
        this.pinned = false;
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        if (this.pinned) {
            this.oldX = x;
            this.oldY = y;
        }
    }
}

// Constraint between two particles
class RopeConstraint {
    particleA: RopeParticle;
    particleB: RopeParticle;
    restLength: number;
    stiffness: number;

    constructor(particleA: RopeParticle, particleB: RopeParticle, stiffness: number = 1) {
        this.particleA = particleA;
        this.particleB = particleB;
        this.restLength = Math.sqrt(
            Math.pow(particleA.x - particleB.x, 2) +
            Math.pow(particleA.y - particleB.y, 2)
        );
        this.stiffness = stiffness;
    }

    satisfy() {
        const dx = this.particleB.x - this.particleA.x;
        const dy = this.particleB.y - this.particleA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        const difference = this.restLength - distance;
        // Apply stiffness more gradually - this allows for more natural rope behavior
        const percent = (difference / distance) * this.stiffness * 0.25; // Reduced from 0.5 for less aggressive correction
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        // Distribute correction based on mass (if we had different masses)
        // For now, split equally between particles
        const correctionA = 0.5;
        const correctionB = 0.5;

        // Only move particles that aren't pinned
        if (!this.particleA.pinned) {
            this.particleA.x -= offsetX * correctionA;
            this.particleA.y -= offsetY * correctionA;
        }

        if (!this.particleB.pinned) {
            this.particleB.x += offsetX * correctionB;
            this.particleB.y += offsetY * correctionB;
        }
    }
}

type RopeProps = {
    segments?: number;
    segmentLength?: number;
    gravity?: number;
    stiffness?: number;
    constraintIterations?: number;
    from: { x: number; y: number };
    to?: { x: number; y: number };
    pinFrom?: boolean;
    pinTo?: boolean;
};

type RopeRef = {
    applyForceToStart: (forceX: number, forceY: number) => void;
    applyForceToEnd: (forceX: number, forceY: number) => void;
    applyForceToSegment: (segmentIndex: number, forceX: number, forceY: number) => void;
    pinStart: () => void;
    unpinStart: () => void;
    pinEnd: () => void;
    unpinEnd: () => void;
    setStartPosition: (x: number, y: number) => void;
    setEndPosition: (x: number, y: number) => void;
    getParticlePosition: (index: number) => { x: number; y: number } | null;
};

export function RopeMesh({ points: ropePoints }: { points: { current: Point[] } }) {

    // Extend PIXI React with required components
    useExtend({ Container, Graphics });

    const containerRef = useRef<Container | null>(null);
    const graphicsRef = useRef<Graphics | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        graphicsRef.current = new Graphics();
        containerRef.current.addChild(graphicsRef.current);

        return () => {
            if (containerRef.current && graphicsRef.current) {
                containerRef.current.removeChild(graphicsRef.current);
                graphicsRef.current.destroy();
            }
        };
    }, []);

    // Draw rope each frame based on points
    useTick(() => {
        const points = ropePoints.current;
        if (!graphicsRef.current || points.length < 2) return;

        const graphics = graphicsRef.current;
        graphics.clear();

        // Draw rope as connected line segments
        graphics.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }

        // Style the rope
        graphics.stroke({
            color: "white", // Brown color
            width: 4,
            cap: 'round',
            join: 'round'
        });

        // Add some rope segments for visual effect
        graphics.clear();
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];

            // Draw segment
            graphics.moveTo(start.x, start.y);
            graphics.lineTo(end.x, end.y);
            graphics.stroke({
                color: "white",
                width: 4,
                cap: 'round'
            });

            // Draw knots at connection points
            graphics.circle(start.x, start.y, 2);
            graphics.fill({ color: "white" });
        }

        // Final knot
        if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            graphics.circle(lastPoint.x, lastPoint.y, 2);
            graphics.fill({ color: "white" });
        }

    });

    return <pixiContainer ref={containerRef} />;
}

export default forwardRef<RopeRef, RopeProps>(function MyRope({
    segments = 10,
    segmentLength = 50,
    gravity = 980, // pixels per second squared
    stiffness = 1,
    constraintIterations = 3,
    from,
    to,
    fromOffset,
    toOffset,
    pinFrom = true,
    pinTo = false
}, ref) {
    const particles = useRef<RopeParticle[]>([]);
    const constraints = useRef<RopeConstraint[]>([]);
    const points = useRef<Point[]>([]);
    const animationFrame = useRef<number | null>(null);
    const lastTime = useRef<number>(performance.now());

    // Initialize physics system
    useEffect(() => {
        particles.current = [];
        constraints.current = [];
        points.current = [];
        let handledTo = handlePositionIfRef(to);
        let handledFrom = handlePositionIfRef(from);

        console.log("Initializing rope from", handledFrom, "to", handledTo);

        handledTo.x += toOffset?.x || 0;
        handledTo.y += toOffset?.y || 0;
        handledFrom.x += fromOffset?.x || 0;
        handledFrom.y += fromOffset?.y || 0;

        // Calculate actual segment length if we have both endpoints
        const actualSegmentLength = handledTo ?
            Math.sqrt(Math.pow(handledTo.x - handledFrom.x, 2) + Math.pow(handledTo.y - handledFrom.y, 2)) / (segments - 1) :
            segmentLength;

        // Create particles with initial sag for more natural behavior
        for (let i = 0; i < segments; i++) {
            const progress = i / (segments - 1);
            let x, y;

            if (handledTo) {
                // If we have an end point, interpolate between start and end
                x = handledFrom.x + (handledTo.x - handledFrom.x) * progress;
                y = handledFrom.y + (handledTo.y - handledFrom.y) * progress;

                // Add initial sag to create a more natural catenary-like curve
                // Maximum sag in the middle, tapering off towards the ends
                const sagAmount = actualSegmentLength * 0.5; // Adjust this for more/less initial sag
                const sagFactor = Math.sin(progress * Math.PI); // Sine curve for natural sag
                y += sagFactor * sagAmount;
            } else {
                // If no end point, create a hanging rope
                x = handledFrom.x;
                y = handledFrom.y + i * actualSegmentLength;
            }

            const isFirstParticle = i === 0;
            const isLastParticle = i === segments - 1;
            const shouldPin = (isFirstParticle && pinFrom) || (isLastParticle && pinTo);

            particles.current.push(new RopeParticle(x, y, shouldPin));
            points.current.push(new Point(x, y));
        }

        // Create constraints with proper rest length
        for (let i = 0; i < segments - 1; i++) {
            constraints.current.push(
                new RopeConstraint(particles.current[i], particles.current[i + 1], stiffness)
            );
        }
        //console.log("Rope initialized with particles:", particles.current);
    }, [segments, segmentLength, from, to, stiffness, pinFrom, pinTo]);

    const simulate = useCallback(() => {
        let handledTo = handlePositionIfRef(to);
        let handledFrom = handlePositionIfRef(from);
        //console.log("rope from", handledFrom, "to", handledTo);

        handledTo.x += toOffset?.x || 0;
        handledTo.y += toOffset?.y || 0;
        handledFrom.x += fromOffset?.x || 0;
        handledFrom.y += fromOffset?.y || 0;

        const currentTime = performance.now();
        const deltaTime = Math.min((currentTime - lastTime.current) / 1000, 0.016); // Cap at 60fps
        lastTime.current = currentTime;

        // Update anchor positions FIRST (before physics)
        if (pinFrom && particles.current[0]) {
            particles.current[0].setPosition(handledFrom.x, handledFrom.y);
        }

        if (pinTo && handledTo && particles.current[segments - 1]) {
            particles.current[segments - 1].setPosition(handledTo.x, handledTo.y);
        }

        // Apply gravity to all particles AFTER setting anchor positions
        particles.current.forEach(particle => {
            if (!particle.pinned) {
                particle.applyForce(0, gravity * particle.mass, deltaTime);
            }
        });

        // Update particle positions (Verlet integration)
        particles.current.forEach(particle => {
            particle.update(deltaTime);
        });

        // Satisfy constraints multiple times for stability
        for (let iteration = 0; iteration < constraintIterations; iteration++) {
            constraints.current.forEach(constraint => {
                constraint.satisfy();
            });

            // Re-enforce anchor positions after each constraint iteration
            // This ensures anchors stay in place while allowing natural sag
            if (pinFrom && particles.current[0]) {
                particles.current[0].x = handledFrom.x;
                particles.current[0].y = handledFrom.y;
            }

            if (pinTo && to && particles.current[segments - 1]) {
                particles.current[segments - 1].x = handledTo.x;
                particles.current[segments - 1].y = handledTo.y;
            }
        }

        // Update render points
        particles.current.forEach((particle, index) => {
            if (points.current[index]) {
                points.current[index].x = particle.x;
                points.current[index].y = particle.y;
            }
        });

        animationFrame.current = requestAnimationFrame(simulate);
    }, []);

    // Physics simulation loop
    useEffect(() => {

        animationFrame.current = requestAnimationFrame(simulate);

        return () => {
            if (animationFrame.current) {
                console.log("Cancelling animation frame:", animationFrame.current);
                cancelAnimationFrame(animationFrame.current);
            }
        };
    }, [gravity, constraintIterations, segments, from, to, pinFrom, pinTo]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        applyForceToStart: (forceX: number, forceY: number) => {
            if (particles.current[0]) {
                particles.current[0].applyForce(forceX, forceY, 0.016);
            }
        },
        applyForceToEnd: (forceX: number, forceY: number) => {
            const lastIndex = particles.current.length - 1;
            if (particles.current[lastIndex]) {
                particles.current[lastIndex].applyForce(forceX, forceY, 0.016);
            }
        },
        applyForceToSegment: (segmentIndex: number, forceX: number, forceY: number) => {
            if (particles.current[segmentIndex]) {
                particles.current[segmentIndex].applyForce(forceX, forceY, 0.016);
            }
        },
        pinStart: () => {
            if (particles.current[0]) {
                particles.current[0].pin();
            }
        },
        unpinStart: () => {
            if (particles.current[0]) {
                particles.current[0].unpin();
            }
        },
        pinEnd: () => {
            const lastIndex = particles.current.length - 1;
            if (particles.current[lastIndex]) {
                particles.current[lastIndex].pin();
            }
        },
        unpinEnd: () => {
            const lastIndex = particles.current.length - 1;
            if (particles.current[lastIndex]) {
                particles.current[lastIndex].unpin();
            }
        },
        setStartPosition: (x: number, y: number) => {
            if (particles.current[0]) {
                particles.current[0].setPosition(x, y);
            }
        },
        setEndPosition: (x: number, y: number) => {
            const lastIndex = particles.current.length - 1;
            if (particles.current[lastIndex]) {
                particles.current[lastIndex].setPosition(x, y);
            }
        },
        getParticlePosition: (index: number) => {
            if (particles.current[index]) {
                return { x: particles.current[index].x, y: particles.current[index].y };
            }
            return null;
        }
    }), []);

    return <RopeMesh points={points} />;
});
