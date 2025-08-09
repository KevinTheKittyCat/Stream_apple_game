import { useMemo } from "react";
import { Group } from "../Canvas/Group";
import { Sprite } from "../Canvas/Sprite";
import { scale } from "framer-motion";


const treeTops = [
    { src: "/assets/tree/top/tree_object_01.png", trunk: 30, scale: 0.7 },
    // { src: "/assets/tree/top/tree_object_02.png", trunk: 100, scale: 0.7 },
    { src: "/assets/tree/top/tree_object_03.png", trunk: 70, scale: 0.7 },
    { src: "/assets/tree/top/tree_object_04.png", trunk: 60, scale: 0.7 },
];

const treeTrunks = [
    "/assets/tree/trunk/trunk_object_05.png",
];

export default function TreeSprite({ x, y, scale = 1 }) {
    const { top, trunk } = useMemo(() => {
        const top = treeTops[Math.floor(Math.random() * treeTops.length)];
        const trunk = treeTrunks[Math.floor(Math.random() * treeTrunks.length)];
        return {
            top,
            trunk,
        };
    }, []);

    return (
        <Group scale={scale} x={x} y={y}>
            <Sprite
                anchor={-0.5}
                texture={trunk}
                x={-50}
                y={top.trunk} // Adjust the y position to place the trunk below the top
            />
            <Sprite
                texture={top.src}
                x={0}
                y={0}
                scale={top.scale}
            />
        </Group>
    );
}