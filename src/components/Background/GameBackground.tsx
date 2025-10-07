import { basePath } from "@/config/constants";
import { useWindowStore } from "@/stores/WindowState";
import { useMemo } from "react";
import { Group } from "../Canvas/Group";
import { Sprite } from "../Canvas/Sprite";
import { useParallax } from "./useParallax";

const assets = {
    background: `${basePath}/assets/background/bg.png`,
    clouds: `${basePath}/assets/background/bg_clouds.png`,
    parallaxFar: `${basePath}/assets/background/bg_parallaxFar.png`,
    parallaxNear: `${basePath}/assets/background/bg_parallaxNear.png`,
}

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
        //direction: "horizontal",
    });

    const { ref: forestRef } = useParallax({
        speed: 0.005,
        min: -width * 0.07,
        max: 0,
        offset: -width * 0.04,
        //direction: "horizontal",
    });

    const { ref: grassRef } = useParallax({
        speed: 0.008,
        min: -width * 0.05,
        max: 0,
        offset: -width * 0.02,
        //direction: "horizontal",
    });


    return (
        <>
            <Group>
                <Sprite texture={assets.background} {...backgroundSettings} />
                <Sprite id={"clouds"} ref={cloudsRef} texture={assets.clouds} {...backgroundSettings} />
                <Sprite ref={grassRef} texture={assets.parallaxFar} {...backgroundSettings} />
                <Sprite ref={forestRef} texture={assets.parallaxNear} {...backgroundSettings} />
            </Group>
        </>
    )
}