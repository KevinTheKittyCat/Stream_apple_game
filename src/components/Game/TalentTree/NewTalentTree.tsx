
import { Layer } from '@/components/Canvas/Layer';
import { useTalentTreeStore } from '@/stores/talentTreeState';
import { useEffect } from 'react';
import RopeTree from './RopeTree';
import { allTalents, type TalentType } from './Settings/all';
import { Talent } from './Talent';

export const checkPrerequisites = (talent: TalentType, talents: TalentType[]) => talent?.prerequisites?.every(prereq => {
    const foundTalent = talents.find(t => t.id === prereq.id);
    return foundTalent && foundTalent.currentLevel >= prereq.level;
});


export default function NewTalentTree({ visible = true }: { visible?: boolean }) {
    const { talents, createTalent } = useTalentTreeStore();

    useEffect(() => {
        const arrayFromTalents = Object.values(allTalents);
        const talentsNotSpawned = arrayFromTalents.filter(talent => !talents.find(t => t.id === talent.id));
        talentsNotSpawned.reduce((acc, talent) => {
            let preReqTalent = talents.find(t => t.id === talent?.prerequisites[0]?.id) || null;
            const noPrerequisites = talent.prerequisites.length === 0;
            if ((!preReqTalent || !talent) && !noPrerequisites) return acc;
            if (noPrerequisites || checkPrerequisites(talent, talents)) {
                createTalent({
                    ...talent,
                    settled: 0,
                    position: preReqTalent?.position ? preReqTalent?.position : { x: 500, y: 500 }
                });
            }
            return acc;
        }, []);
    }, [talents]);

    if (!visible) return null;
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