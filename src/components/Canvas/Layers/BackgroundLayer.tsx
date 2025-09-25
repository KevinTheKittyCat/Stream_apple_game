import { useApplication } from "@pixi/react";
import { Layer } from "@/components/Canvas/Layer";
import GameBackground from "@/components/Background/GameBackground";
import Graphic from "../Graphic";
import { useWindowStore } from "@/stores/WindowState";

export default function BackgroundLayer({visible = true}: {visible?: boolean}) {
    const { width, height } = useWindowStore();
    const { isInitialised } = useApplication();

    if (!isInitialised) return null;
    return (
        <Layer
            eventMode="static"
            visible={visible}
            //width={app.renderer.width}
            //height={app.renderer.height}
            /*background={{
                backgroundColor: "#87CEEB", // Sky blue color
            }}*/
        >
            <Graphic
                size={{ width, height: height * 1.5 }}
                //color={"green"}
                y={height / 3}
            />
            <GameBackground />
        </Layer>
    );
}