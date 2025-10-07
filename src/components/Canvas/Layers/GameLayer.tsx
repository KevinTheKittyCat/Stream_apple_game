import { Layer } from "@/components/Canvas/Layer";
import { PowerupsListener } from "@/components/Game/Powerups/PowerupListener";
import { Apple } from "@/components/Objective/Apple";
import AppleSpawner from "@/components/Objective/AppleSpawner";
import { useWindowStore } from "@/stores/WindowState";
import { useApplication } from "@pixi/react";
import { Player } from "../../Player/Player";
import BackgroundLayer from "./BackgroundLayer";

export default function GameLayer({visible = true}: {visible?: boolean}) {
  const { isInitialised } = useApplication();
  const { width, height } = useWindowStore();
  const { apples } = AppleSpawner(); // Limit the number of apples to 10

  if (!isInitialised) return null;
  return (
    <>
      {/* LISTENERS */}
      <PowerupsListener />

      <BackgroundLayer visible={visible} />
      <Layer
        visible={visible}
        eventMode="static"
        width={width}
        height={height}
      >
        <Player />
        {apples.map(apple => (
          <Apple key={apple.id} {...apple} />
        ))}
      </Layer>
    </>
  );
}