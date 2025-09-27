
export const apple_tallents = {
    upgrade_appleScale: {
        id: "upgrade_appleScale",
        levels: 5,
        currentLevel: 1,
        title: "Scale",
        description: "Increases the scale of the apple.",
        effects: [
            { type: "appleScale", multiply: 1.02, suffix: "%" }
        ],
        prerequisites: [],
        spawnOn: { x: 500, y: 500 },
        settled: 2,
        image: "/assets/fruits/Apple.png",
        cost: 20,
        costMultiplier: 1.5,
    },
    upgrade_fall_speed: {
        id: "upgrade_fall_speed",
        levels: 5,
        currentLevel: 1,
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
    upgrade_player_speed: {
        id: "upgrade_player_speed",
        levels: 5,
        currentLevel: 1,
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
    upgrade_apple_value: {
        id: "upgrade_apple_value",
        levels: 5,
        currentLevel: 1,
        title: "Apple Value",
        description: "Increases the value of the apple.",
        effects: [
            { type: "appleValue", add: 1, suffix: "$" }
        ],
        prerequisites: [{ id: "upgrade_player_speed", level: 2 }],
        settled: 0,
        image: "/assets/fruits/Banana.png",
        cost: 15,
        costMultiplier: 1.5,
    },
    increase_time_v1: {
        id: "increase_time_v1",
        levels: 3,
        currentLevel: 1,
        title: "Ain't nobody got time for that",
        description: "Increases the time the apple stays on the screen.",
        effects: [
            { type: "time", add: 20, suffix: "s" }
        ],
        prerequisites: [{ id: "upgrade_player_speed", level: 2 }],
        settled: 0,
        image: "/assets/fruits/Apple.png",
        cost: 20,
        costMultiplier: 1.5,
    },
    good_apple_chance: {
        id: "good_apple_chance",
        levels: 10,
        currentLevel: 1,
        title: "A chance of meatb-Apples",
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
        currentLevel: 1,
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