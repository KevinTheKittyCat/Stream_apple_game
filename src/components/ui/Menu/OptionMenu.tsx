import { useGameStore } from "@/stores/GameState";
import { useCallback, useEffect, useState } from "react";
import "./styles/option-menu.css"
import Score from "../Score/Score";
import TotalTime from "./TotalTime";

export default function OptionMenu() {
    const { timer, updateTimer, resetTimer } = useGameStore()

    if (timer !== 0) return
    return (
        <div className="option-menu">
            <Score />
            <TotalTime/>
            <button>Upgrades / Store</button>
            <button onClick={resetTimer} >Restart</button>
        </div>
    );
}
