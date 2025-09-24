import { useGameStore } from "@/stores/GameState";
import OptionMenu from "./Menu/OptionMenu";
import ApplesCounter from "./Game/Score/ApplesCounter";
import CurrentStatsMenu from "./Game/Score/CurrentStatsMenu";
import Score from "./Game/Score/Score";
import Timer from "./Game/Timer";
import TechtreeUI from "./TechTreeUI/TalentTreeUI";
import PauseMenu from "./Menu/PauseMenu";

export default function MainUi() {
    const { currentPage, timer, state } = useGameStore();
    return (
        <div className="main-ui" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            padding: '0.5em',
        }}>
            <div className="main-ui-inner" style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <PauseMenu />
                {currentPage === 'talentTree' && <TechtreeUI />}
                {currentPage === 'game' && timer <= 0 && state === 'gameOver' && <OptionMenu />}
                {currentPage === 'game' && <CurrentStatsMenu />}
            </div>
            
        </div>
    );
}