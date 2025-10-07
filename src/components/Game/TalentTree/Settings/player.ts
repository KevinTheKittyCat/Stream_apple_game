

import { basePath } from "@/config/constants";
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
        image: `${basePath}/assets/talents/player/Whole_Hand.png`,
        cost: 15,
        costMultiplier: 1.5,
    },
    player_y_axis: {
        id: "player_y_axis",
        levels: 1,
        currentLevel: 0,
        title: "Moving up in the world",
        description: "Allows the player to move on the Y axis.",
        effects: [
            { type: "playerYAxis", boolean: true }
        ],
        prerequisites: [{ id: "upgrade_appleScale", level: 2 }],
        settled: 0,
        image: `${basePath}/assets/talents/player/move_y_axis.png`,
        cost: 200,
        costMultiplier: 1,
    },
    parrot_companion: {
        id: "parrot_companion",
        levels: 1,
        currentLevel: 0,
        title: "Parrot Companion",
        description: "Unlocks a parrot that eats worms from apples for you.",
        effects: [
            { type: "parrotCompanion", boolean: true }
        ],
        prerequisites: [{ id: "upgrade_appleScale", level: 2 }],
        settled: 0,
        image: `${basePath}/assets/companions/parrot/Parrot.png`,
        cost: 300,
        costMultiplier: 1,
    },

    // TODO: Add "dash" talent - requires changing the game mechanics
    // TODO: MAKE PARROT SQUACK WHEN CLICKED

};