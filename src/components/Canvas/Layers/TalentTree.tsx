import { useEffect, useState } from "react";
import { Layer } from "@/components/Canvas/Layer";
import { useApplication } from "@pixi/react";

import { createTalentTree, techs } from "@/components/Game/TalentTree/TalentData";
import NewTalentTree from "@/components/Game/TalentTree/NewTalentTree";
import TalentTreeBackground from "@/components/Background/TalentTreeBackground";

interface TalentNode {
    id: string;
    position: { x: number; y: number };
}

interface TalentLink {
    from: string;
    to: string;
    points: number[];
}

interface TalentTreeData {
    nodes: TalentNode[];
    links: TalentLink[];
}

export default function TalentTree( {visible = true}: {visible?: boolean} ) {
    const { isInitialised } = useApplication();
    const [talentTreeData, setTalentTreeData] = useState<TalentTreeData>({ nodes: [], links: [] });

    useEffect(() => {
        const data = createTalentTree(techs);
        setTalentTreeData(data);
    }, []);

    if (!isInitialised) return null;
    return (
        <>
            <Layer
                visible={visible}
                eventMode="static"
            >
                <TalentTreeBackground />
                <NewTalentTree />
            </Layer>
        </>
    );
}

