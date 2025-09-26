
import { Layer } from '@/components/Canvas/Layer';
import RopeDemo from '@/components/Canvas/RopeDemo';
import { Talent } from './Talent';
import { use, useEffect, useState } from 'react';
import { JSONTALENTS, useTalentTreeStore } from '@/stores/talentTreeState';
import { getStorageItem, setItemRemoveRefStringify } from '@/components/UtilFunctions/Storage/storageHelper';
import RopeTree from './RopeTree';

export default function NewTalentTree() {
    const { talents, createTalent } = useTalentTreeStore();

    useEffect(() => {
        const arrayFromTalents = Object.values(JSONTALENTS);
        const talentsNotSpawned = arrayFromTalents.filter(talent => !talents.find(t => t.id === talent.id));
        talentsNotSpawned.reduce((acc, talent) => {
            let preReqTalent = talents.find(t => t.id === talent?.prerequisites[0].id) || null;
            //if (!preReqTalent) return acc;
            const checkPrerequisites = talent.prerequisites.every(prereq => {
                const foundTalent = talents.find(t => t.id === prereq.id);
                return foundTalent && foundTalent.currentLevel >= prereq.level;
            });
            if (checkPrerequisites) {
                createTalent({
                    ...talent,
                    settled: 0,
                    //id: "talent_" + Date.now(),
                    position: preReqTalent?.position ? preReqTalent?.position : { x: 500, y: 500 }
                });
            }
            return acc;
        }, []);
    }, [talents]);

    return (
        <>
            <Layer>
                {/* ROPES INBETWEEN TALENTS */}
                <RopeTree />
            </Layer>
            <Layer eventMode="passive">
                {
                    talents.map(talent => (
                        <Talent key={talent.id} {...talent} />
                    ))
                }
            </Layer>
        </>
    )
}