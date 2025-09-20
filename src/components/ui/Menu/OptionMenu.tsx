import { useGameStore } from "@/stores/GameState";
import "./styles/option-menu.css"
import TotalTime from "./TotalTime";
import LastScore from "./LastScore";

export default function OptionMenu() {
    const { restartGame, setCurrentPage } = useGameStore()


    return (
        <div className="option-menu">
            <LastScore />
            <TotalTime />
            <button onClick={() => setCurrentPage('talentTree')}>Upgrades / Store</button>
            <button onClick={restartGame} >Restart</button>
        </div>
    );
}
