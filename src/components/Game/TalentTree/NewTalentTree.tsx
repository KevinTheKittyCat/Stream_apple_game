
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
        if (!talents.length) createTalent({
            ...JSONTALENTS.firstTalent,
            position: { x: 500, y: 500 }
        });

        const interval = setInterval(() => {
            if (talents.length >= 4) return;
            const newTalent = {
                ...JSONTALENTS.secondTalent,
                settled: 0,
                id: Date.now(),
                position: { x: 500, y: 500 }
            };
            createTalent(newTalent);
        }, 2000);
        return () => clearInterval(interval);
    }, [talents]);

    return (
        <>
            <Layer>
                {/* ROPES INBETWEEN TALENTS */}
                 <RopeTree />
            </Layer>
            <Layer>
                {
                    talents.map(talent => (
                        <Talent key={talent.id} {...talent} />
                    ))
                }
            </Layer>
        </>
    )
}