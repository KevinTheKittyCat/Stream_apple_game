import CurrentStatsMenu from "@/components/ui/Game/CurrentStatsMenu";
import OptionMenu from "@/components/ui/Menu/OptionMenu";
import PauseMenu from "@/components/ui/Menu/PauseMenu";
import UIWrapper from "@/components/ui/UIWrapper";
import { useGameStore } from "@/stores/GameState";

export default function GameUI() {
    const { state } = useGameStore();
    return (
        <UIWrapper>
            <PauseMenu />
            { state === 'gameOver' && <OptionMenu />}
            <CurrentStatsMenu />
        </UIWrapper>
    );
}