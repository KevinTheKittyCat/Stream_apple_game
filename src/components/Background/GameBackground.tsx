import { useMemo, useRef } from "react";
import TreeSprite from "./Tree";
import { Group } from "../Canvas/Group";
import { Sprite } from "../Canvas/Sprite";
import { useTick } from "@pixi/react";
import { UPDATE_PRIORITY } from "node_modules/pixi.js/lib/ticker/const";
import { useParallax } from "./useParallax";






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

    const backgroundSettings = useMemo(() => ({
        width: window.innerWidth * 1.1,
        height: window.innerHeight,
    }), []);

    const { ref: cloudsRef } = useParallax({
        speed: 0.01,
        min: -window.innerWidth * 0.1,
        max: 0,
        offset: -window.innerWidth * 0.02,
        direction: "horizontal",
    });

    const { ref: forestRef } = useParallax({
        speed: 0.005,
        min: -window.innerWidth * 0.07,
        max: 0,
        offset: -window.innerWidth * 0.04,
        direction: "horizontal",
    });

    const { ref: grassRef } = useParallax({
        speed: 0.008,
        min: -window.innerWidth * 0.05,
        max: 0,
        offset: -window.innerWidth * 0.02,
        direction: "horizontal",
    });




    return (
        <>
            <Group>
                <Sprite texture="/assets/background/bg.png" {...backgroundSettings} />
                <Sprite ref={cloudsRef} texture="/assets/background/bg_clouds.png" {...backgroundSettings} />
                <Sprite ref={grassRef} texture="/assets/background/bg_parallaxFar.png" {...backgroundSettings} />
                <Sprite ref={forestRef} texture="/assets/background/bg_parallaxNear.png" {...backgroundSettings} />
            </Group>
            {/*<Group>
                {trees.map(tree => (
                    <TreeSprite
                        key={tree.id}
                        x={tree.position.x}
                        y={tree.position.y}
                        scale={groupScale}
                    />
                ))}
            </Group>
            */ }

        </>
    )
}