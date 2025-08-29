import { Layer } from "@/components/Canvas/Layer";
import Graphic from "@/components/Canvas/Graphic";
import GameBackground from "@/components/Background/GameBackground";
import { Group } from "@/components/Canvas/Group";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTalentTreeStore, type TalentType } from "@/stores/talentTreeState";
import { useTick } from "@pixi/react";
import { UPDATE_PRIORITY } from "pixi.js";
import { checkHitMultiple, checkHitMultipleWithId } from "@/components/Player/HitDetection";
export const { outer, inner, overlap } = { outer: 50, inner: 30, overlap: 100 };

export function Talent({ id, position, settled, prerequisites }: TalentType) {
    const groupRef = useRef(null);
    const { setTalentRef, talents } = useTalentTreeStore();
    const [shouldSettle, setShouldSettle] = useState<number>(settled || 0);


    useEffect(() => {
        if (!groupRef.current) return;
        setTalentRef(id, groupRef);
    }, [groupRef]);

    useEffect(() => {
        if (shouldSettle === 2) return;
        const timeout = setTimeout(() => {
            if (!shouldSettle) {
                setShouldSettle(2);
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [shouldSettle]);

    const onHit = useCallback((obj, objHits) => {
        // Move away from other talents
        //console.log("obj hit", obj, objHits);
        //console.log("Hit detected:", obj, objHits);

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

    /*const preReqs = useMemo(() => {
        return talents.filter((talent) =>
            prerequisites.some(prereq => prereq.id === talent.id
            /*&& prereq.level <= talent.currentLevel)
        );
    }, [talents, id]);*/

    return (
        <>
            <Group
                ref={groupRef}
                x={position.x}
                y={position.y}
            >
                <Graphic
                    size={{ width: outer, height: outer }}
                    color={"green"}
                    x={overlap / 2 - outer / 2}
                    y={overlap / 2 - outer / 2}
                />
                <Graphic
                    size={{ width: inner, height: inner }}
                    color={"blue"}
                    x={overlap / 2 - inner / 2}
                    y={overlap / 2 - inner / 2}
                />
                <Graphic
                    size={{ width: overlap, height: overlap }}
                    color={"rgba(255,0,0,0.1)"}
                    x={0}
                    y={0}
                />
            </Group>
        </>
    );
}