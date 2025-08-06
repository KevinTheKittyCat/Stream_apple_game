import { useApplication } from "@pixi/react";
import { Player } from "../../Player/Player";
import { Layer } from "@/components/Canvas/Layer";
import { Apple } from "@/components/Objective/Apple";
import { useEffect } from "react";
import AppleSpawner from "@/components/Objective/AppleSpawner";

export default function PlayerLayer() {
  const { isInitialised, app } = useApplication();
  const { apples } = AppleSpawner({ limit: 10 }); // Limit the number of apples to 10

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
      {apples.map(apple => (
        <Apple key={apple.id} id={apple.id} {...apple} />
      ))}
    </Layer>
  );
}