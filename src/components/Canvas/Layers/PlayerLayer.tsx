import { useApplication } from "@pixi/react";
import { Player } from "../../Player/Player";
import { Layer } from "@/components/Canvas/Layer";
import { Apple } from "@/components/Objective/Apple";
import AppleSpawner from "@/components/Objective/AppleSpawner";
import BackgroundLayer from "./BackgroundLayer";

export default function PlayerLayer() {
  const { isInitialised } = useApplication();
  const { apples } = AppleSpawner({ limit: 10 }); // Limit the number of apples to 10


  if (!isInitialised) return null;
  return (
    <>
      <BackgroundLayer />
      <Layer
        eventMode="static"
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Player />
        {apples.map(apple => (
          <Apple key={apple.id} id={apple.id} {...apple} />
        ))}
      </Layer>
    </>
  );
}