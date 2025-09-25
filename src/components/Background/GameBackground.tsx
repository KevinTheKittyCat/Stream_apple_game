import { useMemo } from "react";
import { Group } from "../Canvas/Group";
import { Sprite } from "../Canvas/Sprite";
import { useParallax } from "./useParallax";
import { useWindowStore } from "@/stores/WindowState";

export default function GameBackground() {
    const { width, height } = useWindowStore();
 

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
        </>
    )
}