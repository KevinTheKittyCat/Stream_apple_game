import { Layer } from "@/components/Canvas/Layer";
import Graphic from "@/components/Canvas/Graphic";
import GameBackground from "@/components/Background/GameBackground";
import { Group } from "@/components/Canvas/Group";
import { useMemo, useRef } from "react";


export default function Talent({ id, position }) {
    const groupRef = useRef(null);

    const outer = 50;
    const inner = 30;
    const upgrade = 20
    return (
        <Group
            ref={groupRef}
            x={position.x}
            y={position.y}
        >
            <Graphic
                size={{ width: outer, height: outer }}
                color={"green"}
            />
            <Graphic
                size={{ width: inner, height: inner }}
                color={"blue"}
                x={outer / 2 - inner / 2}
                y={outer / 2 - inner / 2}
            />

        </Group>
    );
}