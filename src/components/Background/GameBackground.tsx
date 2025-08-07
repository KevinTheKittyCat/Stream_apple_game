import { useMemo } from "react";
import TreeSprite from "./Tree";






export default function GameBackground() {
    const groupScale = useMemo(() => {
        return window.innerHeight / 1500; // Adjust scale based on window height
    }, []);
    const treePerPixel = useMemo(() => 200 * groupScale, [groupScale]); // Pixels per tree
    const treeLength = window.innerWidth / treePerPixel; // Number of trees to render
    const trees = useMemo(() => Array.from({ length: treeLength }, (_, i) => ({
        id: i,
        position: {
            x: Math.random() * treePerPixel + i * treePerPixel - treePerPixel,
            y: Math.random() * (100 * groupScale),
        },
    })), []);

    return (
        <>
            {trees.map(tree => (
                <TreeSprite
                    key={tree.id}
                    x={tree.position.x}
                    y={tree.position.y}
                    scale={groupScale}
                />
            ))}

        </>
    )
}