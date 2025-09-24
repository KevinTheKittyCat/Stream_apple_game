import { useGameStore } from "@/stores/GameState";
import OptionMenu from "@/components/ui/Menu/OptionMenu";
import CurrentStatsMenu from "@/components/ui/Game/Score/CurrentStatsMenu";
import PauseMenu from "@/components/ui/Menu/PauseMenu";
import UIWrapper from "@/components/ui/UIWrapper";

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