import type { Powerup } from '@/components/Game/Powerups/PowerupList';
import { create } from 'zustand';

export type activePowerup = {
    uid: string
} & Partial<Powerup>; // Add a unique identifier to each active powerup

interface PowerupState {
    powerups: activePowerup[];
}

export interface PowerupActions {
    setPowerups: (newPowerups: activePowerup[] | ((currentPowerups: activePowerup[]) => activePowerup[])) => void;
    resetPowerups: () => void;
    addPowerup: (powerup: Powerup) => void;
    removePowerup: (powerup: string | Powerup | activePowerup) => void;
}

type PowerupStoreProps = PowerupState & PowerupActions;

const isActivePowerup = (powerup: string | Powerup | activePowerup): powerup is activePowerup => {
    return typeof powerup === 'object' && powerup !== null && 'uid' in powerup;
};

export const usePowerupStore = create<PowerupStoreProps>((set) => ({
    powerups: [],
    setPowerups: (newPowerups) => {
        if (newPowerups instanceof Function) {
            return set((state) => ({ powerups: newPowerups(state.powerups) }));
        }
        set({ powerups: newPowerups });
    },
    resetPowerups: () => set({ powerups: [] }),
    addPowerup: (powerup) => set((state) => {
        return {
            powerups: [
                ...state.powerups.filter(p => !(p.id === powerup.id && powerup.refresh)), // Remove existing if refresh is true
                { uid: crypto.randomUUID(), ...powerup }]
        }
    }),
    removePowerup: (powerup) => set((state) => ({
        powerups: isActivePowerup(powerup) && powerup.uid ?
            state.powerups.filter(p => p.uid !== powerup.uid) :
            state.powerups.filter(p => p.id !== (typeof powerup === 'string' ? powerup : powerup.id))
            
    })),
}));
