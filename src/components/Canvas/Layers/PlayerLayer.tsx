import { useApplication } from "@pixi/react";
import { Player } from "../../Player/Player";
import { Layer } from "@/components/Canvas/Layer";
import { Apple } from "@/components/Objective/Apple";
import { useEffect } from "react";

export default function PlayerLayer() {
    const { isInitialised, app } = useApplication();

    useEffect(() => {
        window.addEventListener('resize', () => {
          if (app) {
            app.renderer.resize(window.innerWidth, window.innerHeight);
          }
        });
      }, []);

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