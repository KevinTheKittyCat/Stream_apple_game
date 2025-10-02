import { apple_tallents } from "./apple-talents"
import { basket_talents } from "./basket"
import { player_talents } from "./player";
import { time_talents } from "./time";

const allTalents = {
    ...apple_tallents,
    ...basket_talents,
    ...player_talents,
    ...time_talents
};

export {
    allTalents
} 