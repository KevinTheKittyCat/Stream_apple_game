import { useApplication } from "@pixi/react";
import { Layer } from "@/components/Canvas/Layer";
import GameBackground from "@/components/Background/GameBackground";
import Graphic from "../Graphic";

export default function BackgroundLayer() {
    const { isInitialised, app } = useApplication();

    if (!isInitialised) return null;
    return (
        <Layer
            eventMode="static"
            //width={app.renderer.width}
            //height={app.renderer.height}
            /*background={{
                backgroundColor: "#87CEEB", // Sky blue color
            }}*/
        >
            <Graphic
                size={{ width: app.renderer.width, height: app.renderer.height * 1.5 }}
                color={"green"}
                y={app.renderer.height / 3}
            />
            <GameBackground />
        </Layer>
    );
}