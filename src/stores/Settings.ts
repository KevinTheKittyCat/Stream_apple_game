import { getStorageItem, setStorageItem } from "@/components/UtilFunctions/Storage/storageHelper";
import { create } from "zustand";

interface SettingsState {
    sound: {
        musicVolume: number;
        effectsVolume: number;
        ambientVolume: number;
        masterVolume: number;
    };
}

interface SettingsActions {
    updateSoundSettings: (newSettings: Partial<SettingsState['sound']>) => void;

}


type SettingsStoreProps = SettingsState & SettingsActions;

const getDefaultSoundSettings = (): SettingsState['sound'] => {
    if (getStorageItem("soundSettings")) return getStorageItem("soundSettings");
    
    return {
        musicVolume: 50,
        effectsVolume: 50,
        ambientVolume: 50,
        masterVolume: 50,
    };
};

export const useSettingsStore = create<SettingsStoreProps>((set) => ({
    sound: getDefaultSoundSettings(),

    updateSoundSettings: (newSettings: Partial<SettingsState['sound']>) => set((state) => {
        const settings = {
            ...state.sound,
            ...newSettings,
        };
        setStorageItem("soundSettings", settings);
        return ({
            sound: settings
        });
    })
}))