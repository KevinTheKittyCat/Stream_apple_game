import { useApplication } from "@pixi/react";
import { Player } from "../../Player/Player";
import { Layer } from "@/components/Canvas/Layer";
import { Apple } from "@/components/Objective/Apple";





export default function PlayerLayer() {
    const { isInitialised } = useApplication();

    if (!isInitialised) return null;
    return (
        <Layer
            eventMode="static"
            width={window.innerWidth}
            height={window.innerHeight}
             
        >
            <Player />
            <Apple />
        </Layer>
    );
}