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
  const objectives = useObjectivesStore((state) => state.objectives.ids);
  const talents = useTalentTreeStore((state) => state.talents);
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
        {objectives.map(id => (
          <Apple key={id} id={id} />
        ))}
      </Layer>
    </>
  );
}
