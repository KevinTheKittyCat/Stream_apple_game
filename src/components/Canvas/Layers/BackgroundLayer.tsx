import { useApplication } from "@pixi/react";
import { Layer } from "@/components/Canvas/Layer";
import GameBackground from "@/components/Background/GameBackground";
import Graphic from "../Graphic";

export default function BackgroundLayer() {
    const { isInitialised } = useApplication();

    if (!isInitialised) return null;
    return (
        <Layer
            eventMode="static"
            width={window.innerWidth}
            height={window.innerHeight}
            /*background={{
                backgroundColor: "#87CEEB", // Sky blue color
            }}*/
        >
            <Graphic
                size={{ width: window.innerWidth, height: window.innerHeight / 1.5 }}
                color={"green"}
                y={window.innerHeight / 3}
            />
            <GameBackground />
        </Layer>
    );
}