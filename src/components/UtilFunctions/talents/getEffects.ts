import { useTalentTreeStore } from "@/stores/talentTreeState";
import type { TalentEffect } from "../../Game/TalentTree/Settings/all";

type ApplyEffectsProps = (
    number: number,
    id: TalentEffect["type"]
) => number;

export const applyEffects: ApplyEffectsProps = (number, id) => {
    const effectsDict = useTalentTreeStore.getState().talentsDict;
    const effects = effectsDict[id] || [];

    if (!effects || effects.length === 0) return number;
    return effects.reduce((acc, effect) => {
        if (effect.multiply) acc *= Math.pow(effect.multiply, effect.level);
        if (effect.divide) acc /= Math.pow(effect.divide, effect.level);
        if (effect.add) acc += effect.add * effect.level;
        if (effect.set) acc = effect.set * effect.level;
        if (effect.minus) acc -= effect.minus * effect.level;
        if (effect.boolean) acc = 1;
        return acc;
    }, number);
}
