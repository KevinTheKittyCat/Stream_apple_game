import { Layer } from "@/components/Canvas/Layer";
import { PowerupsListener } from "@/components/Game/Powerups/PowerupListener";
import { Apple } from "@/components/Objective/Apple";
import AppleSpawner from "@/components/Objective/AppleSpawner";
import { Parrot } from "@/components/Player/Parrot";
import { applyEffects } from "@/components/UtilFunctions/talents/getEffects";
import { useObjectivesStore } from "@/stores/Objectives";
import { useTalentTreeStore } from "@/stores/talentTreeState";
import { useWindowStore } from "@/stores/WindowState";
import { useApplication } from "@pixi/react";
import { useMemo } from "react";
import { Player } from "../../Player/Player";
import BackgroundLayer from "./BackgroundLayer";

export default function GameLayer({visible = true}: {visible?: boolean}) {
  const { isInitialised } = useApplication();
  const { width, height } = useWindowStore();
  const apples = useObjectivesStore((state) => state.apples);
  const { talents } = useTalentTreeStore();
  const hasParrot = useMemo(() => applyEffects(0, "parrotCompanion"), [applyEffects, talents]);
  
  if (!isInitialised) return null;
  return (
    <>
      <AppleSpawner />
      {/* LISTENERS */}
      <PowerupsListener />

      <BackgroundLayer visible={visible} />
      <Layer
        visible={visible}
        eventMode="static"
        width={width}
        height={height}
      >
        {hasParrot ? <Parrot /> : null}
        <Player />
        {apples.map(apple => (
          <Apple key={apple.id} {...apple} />
        ))}
      </Layer>
    </>
  );
}
