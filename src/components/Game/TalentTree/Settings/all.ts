import { apple_talents } from "./apple-talents"
import { basket_talents } from "./basket"
import { player_talents } from "./player";
import { time_talents } from "./time";

export type TalentEffect = {
    type: string;
    multiply?: number,
    divide?: number,
    add?: number,
    set?: number,
    minus?: number,
    boolean?: boolean,

    prefix?: string | React.JSX.Element | React.ComponentType<any>,
    suffix?: string | React.JSX.Element | React.ComponentType<any> | HTMLDivElement,
}

export type TalentType = {
    id: string;
    position?: { x: number; y: number } | null;
    levels: number;
    currentLevel: number;
    title: string;
    description: string;
    effects: TalentEffect[];
    prerequisites: Array<{ id: string; level: number }>;
    settled: number;
    image: string;
    cost: number,
    costMultiplier: number,
};

export type TalentDict = { [key: string]: TalentType };


const allTalents = {
    ...apple_talents,
    ...basket_talents,
    ...player_talents,
    ...time_talents
} as TalentDict;

export {
    allTalents
} 