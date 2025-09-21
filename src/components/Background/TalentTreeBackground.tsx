import { useMemo } from "react";
import { Layer } from "../Canvas/Layer";
import Star from "./TalentTree/Star";
import { useWindowStore } from "@/stores/WindowState";



const STAR_RADIUS = 10;


export default function TalentTreeBackground() {
    const { width, height } = useWindowStore();

    const stars = useMemo(() => {
        const normalAmount = 30 / 1.7; // 1.7 is 1920/1080 ratio
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

    return (
        <Layer
            eventMode="static"
            background={{
                backgroundColor: "purple",
                alpha: 1
            }}
        >
            {stars.map((pos, index) => (
                <Star key={index} position={pos} size={STAR_RADIUS} />
            ))}
            {/* Test Stars */}
            {/*
            <Star position={{ x: 100, y: 100 }} />
            <Star position={{ x: 300, y: 200 }} />
            <Star position={{ x: 500, y: 150 }} />
            */}
        </Layer>
    );
}
