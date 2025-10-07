import { useEventEmitter } from "@/hooks/useEventEmitter";
import { usePowerupStore, type activePowerup } from "@/stores/PowerupState";
import { useEffect } from "react";
import { PowerupList, type Powerup } from "./PowerupList";

const handlePowerupIdOrString = (powerup: string | Powerup) => {
    const powerupId = typeof powerup === "string" ? powerup : powerup.id
    return PowerupList[powerupId] ?? null;
};

export function PowerupsListener() {
    const { powerups, addPowerup } = usePowerupStore();

    useEventEmitter('powerup', (powerup: string | Powerup) => {
        addPowerup(handlePowerupIdOrString(powerup));
    });

    return powerups.map(powerup => <PowerupHandler key={powerup.uid} powerup={powerup} />);
}

function PowerupHandler({ powerup }: { powerup: activePowerup }) {
    const { removePowerup } = usePowerupStore();

    useEffect(() => {
        if (!powerup.duration) return; // No duration means it's a permanent powerup
        const timer = setTimeout(() => {
            removePowerup(powerup);
        }, powerup.duration);

        return () => clearTimeout(timer); // Cleanup on unmount or powerup change
    }, [powerup]);

    return null; // This component doesn't render anything
}

