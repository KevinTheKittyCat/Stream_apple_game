import { basePath } from "@/config/constants";

export type Powerup = {
    id: string;
    name: string;
    description: string;
    icon: string;
    duration?: number; // Duration in milliseconds
    refresh?: boolean; // If true, re-adding the same powerup will refresh its duration
};

export const goldenRush: Powerup = {
    id: "goldenRush",
    name: "Golden Rush",
    description: "Doubles the points from all apples for 15 seconds.",
    icon: `${basePath}/assets/powerups/golden_rush.png`,
    duration: 15000, // Duration in milliseconds
};

export const PowerupList: Record<string, Powerup> = {
    goldenRush
};