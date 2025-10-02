import type { TalentType } from "@/stores/talentTreeState";
import { apple_tallents } from "./apple-talents"
import { basket_talents } from "./basket"
import { player_talents } from "./player";
import { time_talents } from "./time";

export type TalentDict = { [key: string]: TalentType };

const allTalents = {
    ...apple_tallents,
    ...basket_talents,
    ...player_talents,
    ...time_talents
} as TalentDict;

export {
    allTalents
} 