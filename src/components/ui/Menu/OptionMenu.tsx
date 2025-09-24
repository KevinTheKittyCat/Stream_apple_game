import { useGameStore } from "@/stores/GameState";
import "./styles/option-menu.css"
import TotalTime from "./TotalTime";
import LastScore from "./LastScore";
import { eventEmitter } from "@/utils/Eventemitter";

export default function OptionMenu() {
    const { restartGame } = useGameStore()

    const goToStore = () => {
        eventEmitter.emit('changeRoute', { route: '/talentTree' });
    }

    return (
        <div className="option-menu">
            <LastScore />
            <TotalTime />
            <button onClick={goToStore}>Upgrades / Store</button>
            <button onClick={restartGame} >Restart</button>
        </div>
    );
}
