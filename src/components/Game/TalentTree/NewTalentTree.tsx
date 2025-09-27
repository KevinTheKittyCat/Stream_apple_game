
import { Layer } from '@/components/Canvas/Layer';
import { Talent } from './Talent';
import { useEffect } from 'react';
import { useTalentTreeStore} from '@/stores/talentTreeState';
import { allTalents } from './Settings/all';
import RopeTree from './RopeTree';


export default function NewTalentTree() {
    const { talents, createTalent } = useTalentTreeStore();

    useEffect(() => {
        const arrayFromTalents = Object.values(allTalents);
        const talentsNotSpawned = arrayFromTalents.filter(talent => !talents.find(t => t.id === talent.id));
        talentsNotSpawned.reduce((acc, talent) => {
            let preReqTalent = talents.find(t => t.id === talent?.prerequisites[0].id) || null;
            const checkPrerequisites = talent.prerequisites.every(prereq => {
                const foundTalent = talents.find(t => t.id === prereq.id);
                return foundTalent && foundTalent.currentLevel >= prereq.level;
            });
            if (checkPrerequisites) {
                createTalent({
                    ...talent,
                    settled: 0,
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