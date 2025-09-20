import { useGameStore } from "@/stores/GameState";

export default function TotalTime() {
    const { totalTime } = useGameStore()
    //const [timer, setTimer] = useState(5);
    //const timeSpent = useMemo(() => (new Date() - time) / 1000, [time])

    return (
        <div className="" style={{display:"flex", gap: "0.5em"}}>
            <h1>Total Time:</h1>
            <h1>{String(totalTime.toFixed(2)).padStart(5, "0")}</h1>
        </div>
    );
}

// Edited by Kevin :D