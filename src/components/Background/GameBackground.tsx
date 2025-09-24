import { useMemo, useRef } from "react";
import { Group } from "../Canvas/Group";
import { Sprite } from "../Canvas/Sprite";
import { useParallax } from "./useParallax";
import { useWindowStore } from "@/stores/WindowState";

export default function GameBackground() {
    const { width, height } = useWindowStore();
    const groupScale = useMemo(() => {
        return height / 1500; // Adjust scale based on window height
    }, [height]);
    const treePerPixel = useMemo(() => 200 * groupScale, [groupScale]); // Pixels per tree
    const treeLength = width / treePerPixel; // Number of trees to render
    const trees = useMemo(() => Array.from({ length: treeLength }, (_, i) => ({
        id: i,
        position: {
            x: Math.random() * treePerPixel + i * treePerPixel - treePerPixel,
            y: Math.random() * (100 * groupScale),
        },
    })), []);

    const backgroundSettings = useMemo(() => {
        return {
            width: width * 1.1,
            height: height,
        }
    }, [width, height]);

    const { ref: cloudsRef } = useParallax({
        speed: 0.05,
        min: -width * 0.1,
        max: 0,
        offset: -width * 0.02,
        direction: "horizontal",
    });

    const { ref: forestRef } = useParallax({
        speed: 0.005,
        min: -width * 0.07,
        max: 0,
        offset: -width * 0.04,
        direction: "horizontal",
    });

    const { ref: grassRef } = useParallax({
        speed: 0.008,
        min: -width * 0.05,
        max: 0,
        offset: -width * 0.02,
        direction: "horizontal",
    });




    return (
        <>
            <Group>
                <Sprite texture="/assets/background/bg.png" {...backgroundSettings} />
                <Sprite id={"clouds"} ref={cloudsRef} texture="/assets/background/bg_clouds.png" {...backgroundSettings} />
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