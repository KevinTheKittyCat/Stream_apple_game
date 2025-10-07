import { basePath } from "@/config/constants";
import type { ObjectiveType } from "@/stores/Objectives";
import { eventEmitter } from "@/utils/Eventemitter";
import { goldenRush } from "../Game/Powerups/PowerupList";

const onHitFunctions: Record<string, (apple: any) => void> = {
    golden_powerup: () => eventEmitter.emit("powerup", goldenRush),
};

export const appleTypes: Record<string, ObjectiveType> = {
    APPLE: { id: "APPLE", value: 1, image: `${basePath}/assets/fruits/Apple.png`, weight: 100, group: ["fruit", "positiveAppleValue"] },
    GOLDEN_APPLE: { id: "GOLDEN_APPLE", value: 2, image: `${basePath}/assets/apple/GoldenApple.png`, weight: 10, group: ["fruit", "positiveAppleValue"] },
    CANDY_APPLE: { id: "CANDY_APPLE", onHit: onHitFunctions.golden_powerup, value: 3, image: `${basePath}/assets/apple/CandyApple.png`, weight: 3, group: ["fruit", "positiveAppleValue"] },
    WORM_APPLE: { id: "WORM_APPLE", value: -1, image: `${basePath}/assets/apple/WormApple.png`, weight: 10, group: ["fruit", "bad"] },
    ROTTEN_APPLE: { id: "ROTTEN_APPLE", value: -2, image: `${basePath}/assets/apple/RottenApple2.png`, weight: 50, group: ["fruit", "bad"] },
    BOMB_APPLE: { id: "BOMB_APPLE", value: 6, image: `${basePath}/assets/apple/BombApple.png`, weight: 1, group: ["fruit", "explosive"] },
    EATEN_APPLE: { id: "EATEN_APPLE", value: 0, image: `${basePath}/assets/apple/EatenApple.png`, weight: 1, group: ["fruit", "negativeApple"] },
}

export type randomAppleTypeOptions = {
    excludedTypes?: string[];
    weights?: { [key: string]: number };
    modifiers?: any // NOT DEVELOPED YET;
    includedTypes?: string[];
    includedGroups?: string[];
    excludedGroups?: string[];
}

export function getRandomAppleType({
    excludedTypes = [],
    modifiers = {},
    includedTypes = [],
    includedGroups = [],
    excludedGroups = []
}: randomAppleTypeOptions = {}): ObjectiveType {
    const availableTypes = Object.keys(appleTypes)
        .filter(type => !excludedTypes.includes(type))
        .filter(type => includedTypes.length === 0 || includedTypes.includes(type))
        .filter(type => includedGroups.length === 0 || appleTypes[type].group.some(group => includedGroups.includes(group)))
        .filter(type => excludedGroups.length === 0 || !appleTypes[type].group.some(group => excludedGroups.includes(group)));
    if (availableTypes.length === 0) return appleTypes.APPLE; // Default type

    const totalWeight = availableTypes.reduce((acc, type) => {
        const weight = modifiers[type] || appleTypes[type].weight;
        return acc + weight;
    }, 0);

    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (const type of availableTypes) {
        const weight = modifiers[type] || appleTypes[type].weight;
        cumulativeWeight += weight;
        if (random < cumulativeWeight) {
            return appleTypes[type];
        }
    }

    return appleTypes.APPLE; // Fallback
}