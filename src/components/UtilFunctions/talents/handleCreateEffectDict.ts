import type { TalentEffect, TalentType } from "../../Game/TalentTree/Settings/all";

export type EffectWithLevel = TalentEffect & { level: number };
export type EffectDictType = { [key: string]: EffectWithLevel[] };

export const handleCreateEffectDict = (talents: TalentType[]) => {
    return talents.reduce((acc, talent) => {
        const effects = talent.effects || [] as TalentEffect[];
        for (const effect of effects) {
            if (!effect.type) continue;
            if (talent.currentLevel < 1) continue;
            if (!acc[effect.type]) acc[effect.type] = [];
            acc[effect.type].push({ ...effect, level: talent.currentLevel });
        }
        return acc;
    }, {} as EffectDictType);
}