

import type { TalentDict } from "./all";
export const player_talents: TalentDict = {
    upgrade_player_speed: {
        id: "upgrade_player_speed",
        levels: 5,
        currentLevel: 0,
        title: "Player Speed",
        description: "Increases the speed of the player.",
        effects: [
            { type: "playerSpeed", multiply: 1.2, suffix: "%" }
        ],
        prerequisites: [{ id: "upgrade_appleScale", level: 2 }],
        settled: 0,
        image: "https://pixijs.com/assets/bunny.png",
        cost: 15,
        costMultiplier: 1.5,
    },
    // TODO: Add "move on the Y axis" talent - requires changing the game mechanics
    // TODO: Add "dash" talent - requires changing the game mechanics
    // TODO: Add a "friend" - collects apples for you - talent - requires changing the game mechanics
};