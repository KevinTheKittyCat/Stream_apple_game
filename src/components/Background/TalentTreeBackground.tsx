import { useWindowStore } from "@/stores/WindowState";
import { BlurFilter } from "pixi.js";
import { useMemo } from "react";
import { Layer } from "../Canvas/Layer";
import Galaxy from "./TalentTree/Galaxy";
import Star from "./TalentTree/Star";



const STAR_RADIUS = 10;


export default function TalentTreeBackground() {
    const { width, height } = useWindowStore();

    const stars = useMemo(() => {
        const normalAmount = 50 / 1.7; // 1.7 is 1920/1080 ratio
        const starAmount = Math.floor((width / height) * (normalAmount))
        const tempStars = [] as { x: number; y: number; id: string }[];

        // Divide into grid
        const padding = 50;
        const areaToPlaceWithin = 50
        const gridSize = padding + areaToPlaceWithin;
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);

        const getRandomColRow = () => {
            const col = Math.floor(Math.random() * cols);
            const row = Math.floor(Math.random() * rows);
            if (tempStars.find(s => s.id === (col + "-" + row))) {
                return getRandomColRow();
            }
            return {
                col,
                row
            }
        }

        for (let i = 0; i < starAmount; i++) {
            const { col: randomCol, row: randomRow } = getRandomColRow();
            const x = randomCol * gridSize + padding + Math.random() * areaToPlaceWithin;
            const y = randomRow * gridSize + padding + Math.random() * areaToPlaceWithin;
            tempStars.push({ x, y, id: randomCol + "-" + randomRow });
        }
        return tempStars;
    }, [width, height]);

    const filter = useMemo(() => new BlurFilter({
        strength: 8,      // Overall blur strength
        quality: 4,       // Blur quality (higher = better but slower)
        kernelSize: 5     // Size of blur kernel matrix
    }), []);

    return (
        <Layer
            filters={[
                filter,
            ]}
            eventMode="static"
            background={{
                backgroundColor: "#070B34",
                alpha: 1
            }}
        >
            {stars.map((pos, index) => (
                <Star key={index} position={pos} size={STAR_RADIUS * Math.random()} />
            ))}
            <Galaxy alpha={0.1} color={"#855988"} />
            <Galaxy alpha={0.1} color={"#070B34"} />
        </Layer>
    );
}
