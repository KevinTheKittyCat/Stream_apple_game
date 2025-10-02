import { useTalentTreeStore } from "@/stores/talentTreeState";

export const getTalentEffect = (originalNumber: number, type: string): number => {
    const talents = useTalentTreeStore.getState().talents
    const number = talents.reduce((acc: number, talent) => {
        if (talent.currentLevel < 1) return acc;

        const effects = talent.effects.filter(e => e.type === type);
        effects.forEach(e => {
            if (e?.multiply) acc *= Math.pow(e.multiply, talent.currentLevel);
            if (e?.divide) acc /= Math.pow(e.divide, talent.currentLevel);
            if (e?.add) acc += e.add * talent.currentLevel;
            if (e?.set) acc = e.set * talent.currentLevel;
            if (e?.minus) acc -= e.minus * talent.currentLevel;
        });
        return acc;
    }, originalNumber as number);
    return number;
}