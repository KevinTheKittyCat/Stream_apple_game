import { useEffect, useState } from "react";
import { Layer } from "@/components/Canvas/Layer";
import { useApplication } from "@pixi/react";

import { createTalentTree, techs } from "@/components/Game/TalentTree/TalentData";
import Line from "../Line";
import NewTalentTree from "@/components/Game/TalentTree/NewTalentTree";

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

export default function TalentTree() {
    const { isInitialised } = useApplication();
    const [talentTreeData, setTalentTreeData] = useState<TalentTreeData>({ nodes: [], links: [] });

    useEffect(() => {
        const data = createTalentTree(techs);
        console.log("Talent Tree Data:", data);
        setTalentTreeData(data);
    }, []);

    if (!isInitialised) return null;
    return (
        <>
            <Layer
                eventMode="static"
                background={{
                    backgroundColor: "purple",
                    alpha: 1
                }}
            >
                {/*talentTreeData.nodes.map((talent) => (
                    <Talent
                        key={talent.id}
                        {...talent}
                    />
                ))}
                {talentTreeData.links.map((link, index) => {
                    const nodeSize = 50; // From Talent component outer size
                    
                    // Create a copy of the points array to avoid mutating the original
                    const adjustedPoints = [...link.points];

                    // Adjust connection points:
                    // From point: center-right of source node (prerequisite)
                    // To point: center-left of target node (dependent)
                    
                    // Source node: connect from center-right
                    adjustedPoints[0] += nodeSize / 2; // Move to right edge from center
                    // adjustedPoints[1] stays at center Y
                    
                    // Target node: connect to center-left  
                    adjustedPoints[2] -= nodeSize / 2; // Move to left edge from center
                    // adjustedPoints[3] stays at center Y

                    return (
                        <Line
                            key={index}
                            from={{ x: adjustedPoints[0], y: adjustedPoints[1] }}
                            to={{ x: adjustedPoints[2], y: adjustedPoints[3] }}
                            stroke={{ color: "white", width: 2 }}
                        />
                    );
                })*/}
                <NewTalentTree />
            </Layer>
        </>
    );
}

