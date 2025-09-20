import { useTalentTreeStore } from '@/stores/talentTreeState';
import { overlap } from './Talent';
import { useMemo, memo } from 'react';
import MyRope from "../../Canvas/Rope";
import { useWindowStore } from '@/stores/WindowState';

interface PreReqRopeProps {
    req: any;
    talent: any;
}

export default function RopeTree() {
    const { talents } = useTalentTreeStore() as { talents: any[] };

    // Memoize rope connections to prevent unnecessary re-renders
    const ropeConnections = useMemo(() => {
        const connections: Array<{ talent: any; req: any; key: string }> = [];
        
        talents.forEach((talent: any) => {
            talent.prerequisites.forEach((req: any) => {
                connections.push({
                    talent,
                    req,
                    key: `${talent.id}-${req.id}`
                });
            });
        });
        
        return connections;
    }, [talents]);

    return (
        <>
            {ropeConnections.map(({ talent, req, key }) => (
                <PreReqRope key={key} req={req} talent={talent} />
            ))}
        </>
    );
}

const PreReqRope = memo<PreReqRopeProps>(({ req, talent }) => {
    const { talents } = useTalentTreeStore() as { talents: any[] };
    const { scale } = useWindowStore();
    
    const preReq = useMemo(() => 
        talents.find((t: any) => t.id === req.id), 
        [talents, req.id]
    );
    
    // Early return if refs aren't ready
    if (!talent?.ref?.current || !preReq?.ref?.current) {
        return null;
    }

    return (
        <MyRope
            segments={10} // Reduced from 16 for better performance
            gravity={-1200}
            segmentLength={100}
            stiffness={0.8}
            constraintIterations={2} // Reduced from 4 for better performance
            from={talent.ref}
            fromOffset={{ x: (talent.ref.current.width / 2) * scale, y: (talent.ref.current.height / 2) * scale }}
            to={preReq.ref}
            toOffset={{ x: (overlap / 2) * scale, y: (overlap / 2) * scale }}
            pinFrom={true}
            pinTo={true}
        />
    );
});