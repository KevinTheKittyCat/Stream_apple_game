
import { basePath } from "@/config/constants";
import type { TalentDict } from "./all";

export const basket_talents: TalentDict = {
    basket_size_one: {
        id: "basket_size_one",
        levels: 5,
        currentLevel: 0,
        title: "Basket Size I",
        description: "Increases the size of the basket.",
        effects: [
            { type: "basketSize", multiply: 1.1, suffix: "%" }
        ],
        prerequisites: [{ id: "apple_spawn_rate", level: 2 }],
        settled: 0,
        image: `${basePath}/assets/fruits/Apple.png`,
        cost: 20,
        costMultiplier: 1.5,
    }
}