import { useGameStore } from "@/stores/GameState";
import "./styles/option-menu.css"
import TotalTime from "./TotalTime";
import LastScore from "./LastScore";
import { useNavigate } from "@tanstack/react-router";

export default function OptionMenu() {
    const { restartGame, setCurrentPage } = useGameStore()
    const navigate = useNavigate()

    const goToStore = () => {
        setCurrentPage('talentTree')
        navigate({
            to: '/talentTree',
        })
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
