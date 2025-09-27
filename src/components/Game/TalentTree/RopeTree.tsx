import { useTalentTreeStore, type TalentType } from '@/stores/talentTreeState';
import { overlap } from './Talent';
import { useMemo } from 'react';
import MyRope from "../../Canvas/Rope";
import { useWindowStore } from '@/stores/WindowState';

interface PreReqRopeProps {
    talent: TalentType;
}

export default function RopeTree() {
    const { talents } = useTalentTreeStore();

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
    const { talents } = useTalentTreeStore();
    const { scale } = useWindowStore();

    //console.log("Rendering PreReqRope for talent:", talent.id);

    const preReqs = useMemo(() =>
        talent.prerequisites.reduce((acc: any[], req: any) => {
            console.log("Finding preReq for:", req.id);
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
                    if (!preReq?.ref?.current) return null;
                    return <MemoizedPreReqRope key={preReq.id} preReq={preReq} talent={talent} scale={scale} />;
                })
            }
        </>
    );
};

const MemoizedPreReqRope = ({ preReq, talent, scale }) => {
    const myRopeProps = useMemo(() => ({
        key: preReq.id,
        segments: 10, // Reduced from 16 for better performance
        gravity: -1200,
        segmentLength: 100,
        stiffness: 0.8,
        constraintIterations: 2, // Reduced from 4 for better performance
        from: talent.ref,
        fromOffset: { x: (talent.ref.current.width / 2) * scale, y: (talent.ref.current.height / 2) * scale },
        to: preReq.ref,
        toOffset: { x: (overlap / 2) * scale, y: (overlap / 2) * scale },
        pinFrom: true,
        pinTo: true
    }), [preReq.id]);
    return (
        <MyRope
            {...myRopeProps}
        />
    );

}

