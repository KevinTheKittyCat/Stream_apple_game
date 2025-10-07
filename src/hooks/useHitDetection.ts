import { checkHitMultipleWithId } from "@/components/Player/HitDetection";
import { useTick } from "@pixi/react";
import { type Sprite, UPDATE_PRIORITY } from "pixi.js";
import { useCallback } from "react";



type UseHitDetectionProps = {
    context: React.RefObject<Sprite | null>;
    isEnabled?: boolean;
    priority?: number;
    objects: { ref: React.RefObject<Sprite | null>; id: string }[];
    onlyOneTarget?: boolean;
    shouldReturnTarget?: boolean;
    onHit: (hitObjects: { ref: React.RefObject<Sprite | null>; id: string }[], context: React.RefObject<Sprite | null>) => void;
};

export const useHitDetection = ({
    context,
    isEnabled = true,
    priority = UPDATE_PRIORITY.LOW,
    objects = [],
    onlyOneTarget = true,
    shouldReturnTarget = false,
    onHit
}: UseHitDetectionProps) => {

    const detectHitsCallback = useCallback(() => {
        if (!context || !context.current) return;
        const onlyRef = objects.filter(o => o?.ref && o?.ref?.current !== null);
        if (onlyRef.length === 0) return;
        const isHit = checkHitMultipleWithId(onlyRef, context, shouldReturnTarget, onlyOneTarget);
        if (isHit) onHit(isHit, context);
    }, [context, objects, onlyOneTarget, shouldReturnTarget, onHit]);

    useTick({
        callback: detectHitsCallback,
        isEnabled: isEnabled,
        priority: priority,
    });

    return {};
};