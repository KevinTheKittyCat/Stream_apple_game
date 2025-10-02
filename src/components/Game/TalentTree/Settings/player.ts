


export const player_talents = {
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
};