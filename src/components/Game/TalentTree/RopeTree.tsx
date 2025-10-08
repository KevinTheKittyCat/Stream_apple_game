import { useTalentTreeStore } from '@/stores/talentTreeState';
import { useMemo } from 'react';
import MyRope from "../../Canvas/Rope";
import type { TalentType } from './Settings/all';
import { overlap } from './Talent';

interface PreReqRopeProps {
    talent: TalentType;
}

export default function RopeTree() {
    const talents = useTalentTreeStore((state) => state.talents);
    
    return (
        <>
            {talents.map((talent) => {
                if (!talent?.id) return null;
                return (
                    <PreReqRope key={talent.id} talent={talent} />
                );
            })}
        </>
    );
}

const PreReqRope = ({ talent }: PreReqRopeProps) => {
    const talents = useTalentTreeStore((state) => state.talents);

    const preReqs = useMemo(() =>
        talent.prerequisites.reduce((acc: any[], req: any) => {
            const preReq = talents.find((t: any) => t.id === req.id);
            if (preReq) acc.push(preReq);
            return acc;
        }, []),
        [talent]
    );

    return (
        <>
            {
                preReqs.map((preReq) => {
                    if (!preReq?.ref?.current || !talent?.ref?.current) return null;
                    return <MemoizedPreReqRope key={preReq.id} preReq={preReq} talent={talent} />;
                })
            }
        </>
    );
};

const MemoizedPreReqRope = ({ preReq, talent }: { preReq: TalentType; talent: TalentType }) => {
    const myRopeProps = useMemo(() => {
        if (!preReq?.ref?.current || !talent?.ref?.current) return null;
        return ({
            segments: 10, // Reduced from 16 for better performance
            gravity: -1200,
            segmentLength: 100,
            stiffness: 0.8,
            constraintIterations: 2, // Reduced from 4 for better performance
            from: talent.ref,
            fromOffset: { x: (talent.ref.current.width / 2), y: (talent.ref.current.height / 2) },
            to: preReq.ref,
            toOffset: { x: overlap / 2, y: overlap / 2 },
            pinFrom: true,
            pinTo: true
        })
    }, [preReq.id]);
    return (
        <MyRope
            key={preReq.id}
            {...myRopeProps}
        />
    );

}

