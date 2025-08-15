import { useExtend } from "@pixi/react";
import { Point, Container, Graphics } from "pixi.js";
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

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

        const velocityX = (this.x - this.oldX) * 0.99; // Air resistance
        const velocityY = (this.y - this.oldY) * 0.99;

        this.oldX = this.x;
        this.oldY = this.y;

        this.x += velocityX;
        this.y += velocityY;
    }

    applyForce(forceX: number, forceY: number, deltaTime: number) {
        if (this.pinned) return;

        const accelerationX = forceX / this.mass;
        const accelerationY = forceY / this.mass;

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
        const percent = (difference / distance) * this.stiffness;
        const offsetX = dx * percent * 0.5;
        const offsetY = dy * percent * 0.5;

        if (!this.particleA.pinned) {
            this.particleA.x -= offsetX;
            this.particleA.y -= offsetY;
        }

        if (!this.particleB.pinned) {
            this.particleB.x += offsetX;
            this.particleB.y += offsetY;
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

export function RopeMesh({ points }: { points: Point[] }) {
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
    useEffect(() => {
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
            color: 0x8B4513, // Brown color
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
                color: 0x8B4513,
                width: 4,
                cap: 'round'
            });
            
            // Draw knots at connection points
            graphics.circle(start.x, start.y, 3);
            graphics.fill({ color: 0x654321 });
        }
        
        // Final knot
        if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            graphics.circle(lastPoint.x, lastPoint.y, 3);
            graphics.fill({ color: 0x654321 });
        }
        
    }, [points]);

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

        // Create particles
        for (let i = 0; i < segments; i++) {
            const progress = i / (segments - 1);
            const x = from.x + (to ? (to.x - from.x) * progress : 0);
            const y = from.y + (to ? (to.y - from.y) * progress : 0);
            
            const isFirstParticle = i === 0;
            const isLastParticle = i === segments - 1;
            const shouldPin = (isFirstParticle && pinFrom) || (isLastParticle && pinTo);
            
            particles.current.push(new RopeParticle(x, y, shouldPin));
            points.current.push(new Point(x, y));
        }

        // Create constraints
        for (let i = 0; i < segments - 1; i++) {
            const constraintStiffness = stiffness;
            constraints.current.push(
                new RopeConstraint(particles.current[i], particles.current[i + 1], constraintStiffness)
            );
        }
    }, [segments, segmentLength, from, to, stiffness, pinFrom, pinTo]);

    // Physics simulation loop
    useEffect(() => {
        const simulate = () => {
            const currentTime = performance.now();
            const deltaTime = Math.min((currentTime - lastTime.current) / 1000, 0.016); // Cap at 60fps
            lastTime.current = currentTime;

            // Apply gravity to all particles
            particles.current.forEach(particle => {
                particle.applyForce(0, gravity * particle.mass, deltaTime);
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
            }

            // Update anchor positions if they changed
            if (pinFrom && particles.current[0]) {
                particles.current[0].setPosition(from.x, from.y);
            }
            
            if (pinTo && to && particles.current[segments - 1]) {
                particles.current[segments - 1].setPosition(to.x, to.y);
            }

            // Update render points
            particles.current.forEach((particle, index) => {
                if (points.current[index]) {
                    points.current[index].x = particle.x;
                    points.current[index].y = particle.y;
                }
            });

            animationFrame.current = requestAnimationFrame(simulate);
        };

        animationFrame.current = requestAnimationFrame(simulate);

        return () => {
            if (animationFrame.current) {
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

    return <RopeMesh points={points.current} />;
});
