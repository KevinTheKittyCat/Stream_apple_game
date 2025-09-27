import Graphic from "@/components/Canvas/Graphic";
import { Group } from "@/components/Canvas/Group";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTalentTreeStore, type TalentType } from "@/stores/talentTreeState";
import { useTick } from "@pixi/react";
import { UPDATE_PRIORITY, Container } from "pixi.js";
import { checkHitMultipleWithId } from "@/components/Player/HitDetection";
import { Sprite } from "@/components/Canvas/Sprite";
import { useWindowStore } from "@/stores/WindowState";
import TalentHint from "./TalentHint";
import { useGameStore } from "@/stores/GameState";

export const { outer, inner, overlap } = { outer: 50, inner: 30, overlap: 100 };

export function Talent(talent: TalentType) {
    const { id, position, settled, cost } = talent;
    const { currency, incrementCurrency } = useGameStore();
    const groupRef = useRef<Container>(null);
    const { scale } = useWindowStore();
    const { setTalentRef, talents, updateTalent, setHoveringTalent } = useTalentTreeStore();
    const [shouldSettle, setShouldSettle] = useState<number>(settled || 0);

    const onSettle = useCallback(() => {
        setShouldSettle(2);
        updateTalent(id, {
            settled: 2, position: {
                x: groupRef.current?.x || 0,
                y: groupRef.current?.y || 0
            }
        });
    }, []);

    useEffect(() => {
        if (!groupRef.current) return;
        setTalentRef(id, groupRef);
    }, [groupRef]);

    const shouldSettleFunc = () => {
        console.log("Should settle func", shouldSettle);
        if (shouldSettle) {
            onSettle();
        }
    };

    useEffect(() => {
        if (shouldSettle === 2) return;
        console.log("Should settle changed to", shouldSettle);
        const timeout = setInterval(shouldSettleFunc, 5000);
        return () => clearInterval(timeout);
    }, [shouldSettle]);

    const onHit = useCallback((obj, objHits) => {
        // Move away from other talents
        // Physics-based repulsion: push obj away from all hit objects
        objHits.forEach((hitObject) => {
            const { ref } = hitObject;
            const { current: hitObjectCurrent } = ref;
            if (!hitObjectCurrent || !hitObjectCurrent.position || !obj.position) return;

            // Calculate direction vector from hitObject to obj
            let dx = obj.position.x - hitObjectCurrent.position.x;
            let dy = obj.position.y - hitObjectCurrent.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Prevent division by zero

            // If distance is zero, nudge in a random direction
            if (distance === 0) {
                // Random angle
                const angle = Math.random() * 2 * Math.PI;
                dx = Math.cos(angle);
                dy = Math.sin(angle);
                //distance = 0.01; // Small value to avoid division by zero
                distance = Math.max(distance, 1);
            }

            // Repulsion force (gentle movement, clamped)
            let force = 0.05 / distance; // Much smaller, tweak as needed
            // Clamp force to max 2px per tick
            //console.log(force)
            force = Math.max(1, Math.min(force, 2));
            // Normalize direction
            const nx = dx / (distance || 0.01);
            const ny = dy / (distance || 0.01);
            // Apply force
            obj.position.x += nx * force;
            obj.position.y += ny * force;
        });
    }, [id, talents]);

    // Use the `useTick` hook to animate the sprite
    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            if (shouldSettle === 2) return;
            const isHit = checkHitMultipleWithId(talents.filter(talent => talent.id !== id), groupRef.current, false, true);
            if (isHit) onHit(this.current, isHit);
            if (isHit) setShouldSettle(0);
            if (!isHit && shouldSettle < 1) setShouldSettle(1);
        },
        context: groupRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.LOW,
    })

    const onClick = useCallback(() => {
        // Maybe move to talentStore or GameStore
        const { currentLevel, levels, costMultiplier, cost } = talent;
        if (currentLevel >= levels) return console.info("Talent already maxed");
        if (cost > currency) return console.info("Not enough currency");
        incrementCurrency(-cost);
        updateTalent(id, {
            currentLevel: currentLevel + 1,
            cost: Math.floor(cost * costMultiplier)
        });
    }, [currency, talent]);


    const onMouseEnter = useCallback(() => {
        if (!groupRef.current) return
        const globalPos = groupRef.current.getGlobalPosition();
        const bounds = groupRef.current.getBounds();
        setHoveringTalent({ ...talent, x: globalPos.x + bounds.width, y: globalPos.y + (bounds.height / 2) });
    }, [talent]);

    const onMouseLeave = useCallback(() => {
        setHoveringTalent(null);
    }, []);

    return (
        <>
            <Group
                ref={groupRef}
                x={position.x}
                y={position.y}
                scale={{ x: scale, y: scale }}
            >
                <Graphic
                    size={{ width: overlap, height: overlap }}
                    x={0}
                    y={0}
                />
                <Group
                    x={overlap / 2 - outer / 2}
                    y={overlap / 2 - outer / 2}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <Graphic // Background Rectangle
                        size={{ width: outer, height: outer }}
                        rounded={5}
                        color={"#6c507686"}//"#D6BBC0" // NEED MORE TEXTURE VARIATION
                        stroke={{ color: "#EFBF04", width: 2 }}
                    />
                    <Sprite
                        // TODO - Make images centered to the outer rectangle
                        height={inner}
                        texture={talent.image}
                        anchor={0.5}
                        x={outer / 2}
                        y={outer / 2}
                    />
                    {currency < cost && <Graphic
                        size={{ width: outer, height: outer }}
                        rounded={5}
                        color={"rgba(0, 0, 0, 0.4)"} // DEBUG
                    />}
                </Group>
            </Group>
        </>
    );
}