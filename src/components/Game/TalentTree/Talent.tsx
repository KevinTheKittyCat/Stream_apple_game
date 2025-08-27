import { Layer } from "@/components/Canvas/Layer";
import Graphic from "@/components/Canvas/Graphic";
import GameBackground from "@/components/Background/GameBackground";
import { Group } from "@/components/Canvas/Group";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTalentTreeStore, type TalentType } from "@/stores/talentTreeState";
import { useTick } from "@pixi/react";
import { UPDATE_PRIORITY } from "pixi.js";
import { checkHitMultiple, checkHitMultipleWithId } from "@/components/Player/HitDetection";
export const { outer, inner, overlap } = { outer: 50, inner: 30, overlap: 50 };

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

        objHits.forEach((hitObject, index) => {
            //if (index > 0) return; // Only apply to the first hit object for now
            const { ref } = hitObject;
            const { current: hitObjectCurrent } = ref;

            //console.log("Hit object current:", hitObjectCurrent);

            const shouldMoveUp = hitObjectCurrent.position.y <= obj.position.y;
            const shouldMoveLeft = hitObjectCurrent.position.x <= obj.position.x;
            const shouldMoveRight = hitObjectCurrent.position.x > obj.position.x;
            const shouldMoveDown = hitObjectCurrent.position.y > obj.position.y;

            if (shouldMoveUp) obj.position.y -= Number(Math.random()).toFixed(2) * 1 + 0.5 + 1;
            if (shouldMoveLeft) obj.position.x += Number(Math.random()).toFixed(2) * 1 + 0.5 + 1;
            if (shouldMoveRight) obj.position.x -= Number(Math.random()).toFixed(2) * 1 + 0.5 + 1;
            if (shouldMoveDown) obj.position.y += Number(Math.random()).toFixed(2) * 1 + 0.5 + 1;
        })

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