import { basePath } from "@/config/constants";
import { useWindowStore } from "@/stores/WindowState";
import { Box, Flex, type FlexProps } from "@chakra-ui/react";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";



export type StarType = {
    x: number;
    y: number;
    id: string,
    opacity: number,
    animationDelay: string
};

export default function HTMLGalaxyBackground(
    { container, hover = false, ...props }:
        {
            container: React.RefObject<HTMLDivElement | HTMLButtonElement | null>,
            hover?: boolean
        } & FlexProps) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const { width, height } = useWindowStore();

    useLayoutEffect(() => {
        if (!container.current) return;
        const { width, height } = container.current.getBoundingClientRect();
        setDimensions({ width, height });
    }, [width, height]);

    useEffect(() => {
        if (!container.current) return;
        const { width, height } = container.current.getBoundingClientRect();
        setDimensions({ width, height });
    }, [container]);

    const stars = useMemo(() => {
        const { width, height } = dimensions;
        if (width === 0 || height === 0) return [];
        const normalAmount = 5;
        const starAmount = Math.floor((width / height) * (normalAmount));
        const tempStars = [] as StarType[];

        // Divide into grid
        const padding = 5;
        const areaToPlaceWithin = 5
        const gridSize = padding + areaToPlaceWithin;
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);

        // Create array of all available positions
        const availablePositions: { col: number, row: number }[] = [];
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                availablePositions.push({ col, row });
            }
        }

        // Limit stars to available positions
        const maxStars = Math.min(starAmount, availablePositions.length);

        for (let i = 0; i < maxStars; i++) {
            if (availablePositions.length === 0) break;

            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            const { col: randomCol, row: randomRow } = availablePositions[randomIndex];

            // Remove this position from available positions
            availablePositions.splice(randomIndex, 1);

            const x = randomCol * gridSize + padding + Math.random() * areaToPlaceWithin;
            const y = randomRow * gridSize + padding + Math.random() * areaToPlaceWithin;
            tempStars.push({
                x,
                y,
                id: randomCol + "-" + randomRow,
                opacity: 0.1 + Math.random() * 0.3,
                animationDelay: Math.random() * -5 + "s"
            });
        }
        return tempStars;
    }, [dimensions]);

    const RenderStars = useMemo(() => {
        return stars.map((star, index) => {
            return (
                <Star key={star.id} star={star} index={index} hover={hover} />
            )
        })
    }, [stars, hover]);

    return (
        <Flex width={"100%"} height={"100%"} position={"relative"} {...props}>
            {RenderStars}
            <Box
                bg={"galaxyPurple"}
                style={{
                    animation: "moveMask 60s linear infinite",
                    width: "100%", height: "100%", opacity: 0.5,
                    position: "absolute", top: 0, left: 0,
                    mask: `url('${basePath}/assets/galaxy/noise.png') luminance`,
                    WebkitMask: `url('${basePath}/assets/galaxy/noise.png') luminance`,
                }}
            />
        </Flex>
    );
}

// TODO - HOVER RE-RENDERS - FIX THAT.
function Star({ star, index, hover }: { star: StarType, index: number, hover: boolean }) {
    const animation = useMemo(() => hover && Math.random() > 0.5 ? 1 : 0, [hover]);
    const size = useMemo(() => hover && Math.random() > 0.5 ? 8 : 4, [hover]);
    const transitions = useMemo(() => {
        return [
            `--opacity 0.7s ease-in-out`,
            `--opacityMain 0.2s ease-in-out`,
            `width 0.7s ease-in-out`,
            `height 0.7s ease-in-out`,
        ]
    }, []);
    return (
        <Box key={star.id} pos={"absolute"} top={star.y} left={star.x}
            width={`${size}px`} height={`${size}px`} bg={"white"} borderRadius={"50%"}
            //opacity={star.opacity}
            style={{
                "--opacityMain": animation,
                //"--opacity": star.opacity,
                opacity: `max(var(--opacity, 0), var(--opacityMain, 0))`,
                transition: transitions.join(", "),
            } as React.CSSProperties}
            animation={`starPulse 8s infinite forwards, starMovement 7s infinite, twinkle 6s infinite`}
            animationDelay={star.animationDelay}
            filter={index % 2 === 0 ? "blur(1px)" : "blur(3px)"}
        />
    )
}