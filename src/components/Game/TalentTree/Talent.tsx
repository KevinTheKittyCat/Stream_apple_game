import { Layer } from "@/components/Canvas/Layer";
import Graphic from "@/components/Canvas/Graphic";
import GameBackground from "@/components/Background/GameBackground";
import { Group } from "@/components/Canvas/Group";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTalentTreeStore, type TalentType } from "@/stores/talentTreeState";
import { useTick } from "@pixi/react";
import { UPDATE_PRIORITY } from "pixi.js";
import { checkHitMultiple, checkHitMultipleWithId } from "@/components/Player/HitDetection";
import { Sprite } from "@/components/Canvas/Sprite";
import { useWindowStore } from "@/stores/WindowState";
export const { outer, inner, overlap } = { outer: 50, inner: 30, overlap: 100 };

export function Talent({ id, position, settled, prerequisites }: TalentType) {
    const groupRef = useRef(null);
    const { scale } = useWindowStore();
    const { setTalentRef, talents, updateTalent } = useTalentTreeStore();
    const [shouldSettle, setShouldSettle] = useState<number>(settled || 0);

    const onSettle = useCallback(() => {
        setShouldSettle(2);
        console.log("Settling talent", id, groupRef.current?.x, groupRef.current?.y);
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

        // Apply knockback or any other effect
        /*otherTalents.forEach(talent => {
            // Example: Move the talent away from the hit object
            const pos = talent.position
            const sub = pos - obj.position
            const normalize = 
            const direction = talent.position.clone().subtract(obj.position).normalize();
            talent.position.add(direction.scale(10)); // Move away by 10 units
        });*/
    }, [id, talents]);

    // Use the `useTick` hook to animate the sprite
    useTick({
        callback(this: React.RefObject<PixiSprite | null>) {
            //console.log(shouldSettle)
            if (shouldSettle === 2) return;
            //console.log(shouldSettle + " is not 2", "it is " + shouldSettle);
            //console.log(talents)
            const isHit = checkHitMultipleWithId(talents.filter(talent => talent.id !== id), groupRef.current, false, true);
            if (isHit) onHit(this.current, isHit);
            if (isHit) setShouldSettle(0);
            //console.log(isHit)
            if (!isHit && shouldSettle < 1) setShouldSettle(1);
        },
        context: groupRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.LOW,
    })


    return (
        <>
            <Group
                ref={groupRef}
                x={position.x}
                y={position.y}
                scale={{ x: scale, y: scale }}
            >
                <Graphic // Background Rectangle
                    size={{ width: outer, height: outer }}
                    rounded={5}
                    color={"grey"}
                    x={overlap / 2 - outer / 2}
                    y={overlap / 2 - outer / 2}
                />
                <Sprite
                    // TODO - Make images centered to the outer rectangle
                    //size={{ width: overlap, height: overlap }}
                    height={inner}
                    texture={"/assets/fruits/Apple.png"}
                    //size={{ width: inner, height: inner }}
                    //color={"blue"}
                    x={overlap / 2 - inner / 2}
                    y={overlap / 2 - inner / 2}
                />
                <Graphic
                    size={{ width: overlap, height: overlap }}
                    //color={"rgba(255,0,0,0.1)"} // DEBUG
                    x={0}
                    y={0}
                />
            </Group>
        </>
    );
}