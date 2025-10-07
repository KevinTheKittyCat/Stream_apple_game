import GameBackground from "@/components/Background/GameBackground";
import { Layer } from "@/components/Canvas/Layer";
import { useWindowStore } from "@/stores/WindowState";
import { useApplication } from "@pixi/react";
import Graphic from "../Graphic";

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