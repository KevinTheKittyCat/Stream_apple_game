import { useTalentTreeStore } from '@/stores/talentTreeState';
import { outer, inner, overlap } from './Talent';
import { useMemo } from 'react';
import MyRope from "../../Canvas/Rope";

export default function RopeTree() {
    const { talents } = useTalentTreeStore();

    return (
        <>
            {talents.map(talent => talent.prerequisites.map(req => {
                return (
                    <PreReqRope key={`${talent.id}-${req.id}`} req={req} talent={talent} />
                );
            }))}
        </>
    );
}

const PreReqRope = ({ req, talent }) => {
    const { talents } = useTalentTreeStore();
    const preReq = useMemo(() => talents.find(t => t.id === req.id), [talents, req]);
    if (!talent?.ref?.current || !preReq?.ref?.current) return null;
    //console.log(talent?.ref?.current.position, preReq?.ref?.current.position);
    return (
        <MyRope
            key={`${talent.id}-${req.id}`}
            segments={6}
            gravity={1200}
            segmentLength={100}
            stiffness={0.8}
            constraintIterations={4}
            from={talent.ref}
            fromOffset={{ x: talent.ref.current.width / 2, y: talent.ref.current.height / 2 }}
            to={preReq.ref}
            toOffset={{ x: overlap / 2, y: overlap / 2 }}
            pinFrom={true}
            pinTo={true}
        />
    );
}