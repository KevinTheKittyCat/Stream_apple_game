import { AnimatedSprite } from "@/components/Canvas/AnimatedSprite";
import { basePath } from "@/config/constants";
import { useHitDetection } from "@/hooks/useHitDetection";
import { useCompanionStore } from "@/stores/CompanionState";
import { useGameStore } from '@/stores/GameState';
import { useObjectivesStore, type Objective } from '@/stores/Objectives';
import { useWindowStore } from '@/stores/WindowState';
import { AnimatedSprite as PixiAnimatedSprite, type Sprite as PixiSprite } from 'pixi.js';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Group } from '../Canvas/Group';
import { appleTypes } from "../Objective/AppleUtils";
import { removeOffscreen } from "../UtilFunctions/removeOffscreen";
import { findClosestReachableObjective } from "./getNewTarget";
import useAutoMove, { type onReachTargetType } from './useAutoMove';

export function Parrot() {
    const { scale } = useWindowStore();
    const state = useGameStore((state) => state.state);
    const apples = useObjectivesStore((state) => state.apples);
    const removeApple = useObjectivesStore((state) => state.removeApple);
    const updateApple = useObjectivesStore((state) => state.updateApple);
    const { companions, addCompanion, removeCompanion } = useCompanionStore();
    const spriteRef = useRef<PixiSprite>(null);
    const [moveLeft, setMoveLeft] = useState(true);
    const parrotRef = useRef<PixiAnimatedSprite>(null);

    const target = useMemo(() => {
        const wormApples = removeOffscreen(apples.filter(a => a.type.id === "WORM_APPLE"));
        if (wormApples.length === 0) return null;
        const closestApple = findClosestReachableObjective({
            objectives: wormApples,
            ref: spriteRef,
        });
        return closestApple;
    }, [apples]);
    const targetArray = useMemo(() => apples.filter(a => a.type.id === "WORM_APPLE"), [apples]);

    const onReachTarget = useCallback(({ reachedX }: onReachTargetType) => {
        if (reachedX) setMoveLeft(!moveLeft);
    }, [moveLeft, state]);

    const getTargetPositionX = useCallback(() => {
        if (state === 'gameOver') return moveLeft ? window.innerWidth * 0.9 : window.innerWidth * 0.1;
        return moveLeft ? window.innerWidth + 100 : -100;
    }, [moveLeft]);

    const getTargetPositionY = useCallback(() => {
        if (target && target.ref && target.ref.current) {
            return target.ref.current.y;
        }
        return window.innerHeight * 0.2;
    }, [target]);

    const { ref } = useAutoMove({
        id: "parrot",
        enabled: state !== 'paused',
        maxVelocity: 12,
        targetPos: {
            x: getTargetPositionX,
            y: getTargetPositionY
        },
        normalizationFactor: 0.08,
        easingFactor: 1,
        onReachTarget: onReachTarget,
        easing: false,
    });

    useEffect(() => {
        if (spriteRef?.current) ref.current = spriteRef.current
    }, [spriteRef]);

    useEffect(() => {
        if (!spriteRef?.current) return;
        if (companions.find(c => c.id === "parrot")) return;
        addCompanion({ id: "parrot", ref: spriteRef as React.RefObject<PixiSprite> });

        return () => {
            removeCompanion("parrot");
        };
    }, []);

    const scaleAndAnchor = useMemo(() => {
        const scale = 0.8;
        return {
            scale: scale,
            anchor: { x: 0.5, y: 1.1 }
        };
    }, []);

    const spriteToRender = useMemo(() => {
        return <AnimatedSprite
            ref={parrotRef}
            scale={scaleAndAnchor.scale}
            anchor={scaleAndAnchor.anchor}
            textures={[
                `${basePath}/assets/companions/parrot/Parrot_up.png`,
                `${basePath}/assets/companions/parrot/Parrot_down.png`,
            ]}
            animationSpeed={0.15}
            autoPlay={true}
            loop={true}
        />
    }, [scaleAndAnchor]);

    const onHit = useCallback((hitObjects: Objective[], context: PixiSprite | null) => {
        hitObjects.forEach(hitObject => {
            updateApple(hitObject.id, { type: appleTypes.APPLE });
        });
    }, [removeApple]);

    useHitDetection({
        context: spriteRef,
        isEnabled: state === 'playing',
        objects: targetArray,
        onHit: onHit
    });

    return (
        <Group
            ref={spriteRef}
            scale={{ x: moveLeft ? -scale : scale, y: scale }}
            eventMode={'dynamic'}
        >
            {spriteToRender}
        </Group>
    );
}
