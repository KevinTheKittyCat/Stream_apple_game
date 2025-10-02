

import type { TalentDict } from "./all";
export const time_talents: TalentDict = {
    increase_time_v1: {
        id: "increase_time_v1",
        levels: 3,
        currentLevel: 0,
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
};