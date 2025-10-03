import { RiCopperCoinLine } from "react-icons/ri";

import type { TalentDict } from "./all";

export const apple_talents: TalentDict = {
    upgrade_appleScale: {
        id: "upgrade_appleScale",
        levels: 5,
        currentLevel: 0,
        title: "Scale",
        description: "Increases the scale of the apple.",
        effects: [
            { type: "appleScale", multiply: 1.02, suffix: "%" }
        ],
        prerequisites: [],
        settled: 2,
        image: "/assets/fruits/Apple.png",
        cost: 20,
        costMultiplier: 1.5,
    },
    upgrade_fall_speed: {
        id: "upgrade_fall_speed",
        levels: 5,
        currentLevel: 0,
        title: "Newton's Eureka",
        description: "Increases the fall speed of the apple.",
        effects: [
            { type: "fallSpeed", multiply: 1.2, suffix: "%" }
        ],
        prerequisites: [{ id: "upgrade_appleScale", level: 2 }],
        settled: 0,
        image: "/assets/fruits/Orange.png",
        cost: 10,
        costMultiplier: 1.5,
    },
    upgrade_apple_value: {
        id: "upgrade_apple_value",
        levels: 5,
        currentLevel: 0,
        title: "Apple Value",
        description: "Increases the value of the apple.",
        effects: [
            { type: "positiveAppleValue", add: 1, suffix: RiCopperCoinLine }
        ],
        prerequisites: [{ id: "upgrade_player_speed", level: 2 }],
        settled: 0,
        image: "/assets/fruits/Banana.png",
        cost: 15,
        costMultiplier: 1.5,
    },
    good_apple_chance: {
        id: "good_apple_chance",
        levels: 10,
        currentLevel: 0,
        title: "With a chance of apples",
        description: "Increases the chance of getting normal apples.",
        effects: [
            { type: "goodAppleChance", multiply: 1.1, suffix: "%" }
        ],
        prerequisites: [{ id: "upgrade_apple_value", level: 3 }],
        settled: 0,
        image: "/assets/fruits/Apple.png",
        cost: 20,
        costMultiplier: 1.3,
    },
    apple_spawn_rate: {
        id: "apple_spawn_rate",
        levels: 5,
        currentLevel: 0,
        title: "More Apples!",
        description: "Increases the spawn rate of apples.",
        effects: [
            { type: "appleSpawnRate", divide: 1.1, suffix: "%" }
        ],
        prerequisites: [{ id: "good_apple_chance", level: 2 }],
        settled: 0,
        image: "/assets/fruits/Apple.png",
        cost: 20,
        costMultiplier: 1.5,
    }
};