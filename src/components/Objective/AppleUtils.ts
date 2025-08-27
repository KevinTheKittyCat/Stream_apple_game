



export const appleTypes: Record<string, { value: number; image: string; weight: number }> = {
    APPLE: { value: 1, image: "/assets/fruits/Apple.png", weight: 100 },
    GOLDEN_APPLE: { value: 2, image: "/assets/apple/GoldenApple.png", weight: 10 },
    CANDY_APPLE: { value: 3, image: "/assets/apple/CandyApple.png", weight: 3 },
    WORM_APPLE: { value: -1, image: "/assets/apple/WormApple.png", weight: 10 },
    ROTTEN_APPLE: { value: -2, image: "/assets/apple/RottenApple2.png", weight: 50 },
    BOMB_APPLE: { value: 6, image: "/assets/apple/BombApple.png", weight: 1 },
    EATEN_APPLE: { value: 0, image: "/assets/apple/EatenApple.png", weight: 1 },
}

type randomAppleTypeOptions = {
    excludedTypes?: string[];
    weights?: { [key: string]: number };
}

export function getRandomAppleType({ excludedTypes = [], modifiers = {} }: randomAppleTypeOptions = {}): { value: number; image: string } {
    const availableTypes = Object.keys(appleTypes).filter(type => !excludedTypes.includes(type));
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