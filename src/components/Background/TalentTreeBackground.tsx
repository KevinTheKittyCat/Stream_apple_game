import { useMemo } from "react";
import { Layer } from "../Canvas/Layer";
import Star from "./TalentTree/Star";
import { useWindowStore } from "@/stores/WindowState";
import * as PIXI from 'pixi.js';
import { BlurFilter, NoiseFilter } from "pixi.js";
import Galaxy from "./TalentTree/Galaxy";
import Test from "../Canvas/Shaders/Test";



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

    const filter = useMemo(() => new BlurFilter({
        strength: 8,      // Overall blur strength
        quality: 4,       // Blur quality (higher = better but slower)
        kernelSize: 5     // Size of blur kernel matrix
    }), []);

    const noisefilter = useMemo(() => new NoiseFilter({
        noise: 0.05,      // Slightly increased noise intensity
        seed: Math.random(),
        resolution: 0.3   // Lower resolution = bigger chunks (try 0.1-0.5)
    }), []);




    return (
        <Layer
            filters={[
                //filter,
            ]}
            eventMode="static"
            background={{
                gradient: {
                    colorStops: [{
                        color: "#855988",
                        offset: 0
                    }, {
                        color: "#6B4984",
                        offset: 0.3
                    }, {
                        color: "#483475",
                        offset: 0.5
                    }, {
                        color: "#2B2F77",
                        offset: 0.52
                    }, {
                        color: "#141852",
                        offset: 0.54
                    }, {
                        color: "#070B34",
                        offset: 0.7
                    }
                    ],
                    rotation: 45
                },
                alpha: 1
            }}
        >
            {stars.map((pos, index) => (
                <Star key={index} position={pos} size={STAR_RADIUS} />
            ))}
            <Galaxy alpha={0.1} />
            <Galaxy alpha={0.1} />
            {/*<Galaxy />
            <Galaxy />
            */}
            {/* Test Stars */}
            {/*
            <Star position={{ x: 100, y: 100 }} />
            <Star position={{ x: 300, y: 200 }} />
            <Star position={{ x: 500, y: 150 }} />
            */}
        </Layer>
    );
}
