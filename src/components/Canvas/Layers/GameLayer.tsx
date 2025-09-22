import { useApplication } from "@pixi/react";
import { Player } from "../../Player/Player";
import { Layer } from "@/components/Canvas/Layer";
import { Apple } from "@/components/Objective/Apple";
import AppleSpawner from "@/components/Objective/AppleSpawner";
import BackgroundLayer from "./BackgroundLayer";
import { useWindowStore } from "@/stores/WindowState";

export default function GameLayer() {
  const { isInitialised } = useApplication();
  const { width, height } = useWindowStore();
  const { apples } = AppleSpawner(); // Limit the number of apples to 10

  if (!isInitialised) return null;
  return (
    <>
      <BackgroundLayer />
      <Layer
        eventMode="static"
        width={width}
        height={height}
      >
        <Player />
        {apples.map(apple => (
          <Apple key={apple.id} id={apple.id} {...apple} />
        ))}
      </Layer>
    </>
  );
}