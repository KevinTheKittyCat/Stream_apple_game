import { appleTypes, type randomAppleTypeOptions } from "@/components/Objective/AppleUtils";
import { usePowerupStore, type activePowerup } from "@/stores/PowerupState"; // Import the store directly, not the hook


const handlePowerupModifier = (powerup: activePowerup) => {

    switch (powerup.id) {
        case "goldenRush":
            return { includedTypes: [appleTypes.GOLDEN_APPLE.id] };
        default:
            return {};
    }
};

type createPowerupModifierType = {
    includedTypes: string[];
    excludedTypes: string[];
    includedGroups: string[];
    excludedGroups: string[];
}

export const createPowerupTypeModifiers = () => {
    const powerups = usePowerupStore.getState().powerups;
    if (!powerups || powerups.length === 0) return {};
    const modifiers = powerups.reduce((acc, powerup) => {
        const modifier = handlePowerupModifier(powerup) as randomAppleTypeOptions;
        acc.includedTypes = acc.includedTypes.concat(modifier?.includedTypes || []);
        acc.excludedTypes = acc.excludedTypes.concat(modifier?.excludedTypes || []);
        acc.includedGroups = acc.includedGroups.concat(modifier?.includedGroups || []);
        acc.excludedGroups = acc.excludedGroups.concat(modifier?.excludedGroups || []);
        return acc;
    }, {
        includedTypes: [],
        excludedTypes: [],
        includedGroups: [],
        excludedGroups: []
    } as createPowerupModifierType);
    return modifiers as randomAppleTypeOptions;
}