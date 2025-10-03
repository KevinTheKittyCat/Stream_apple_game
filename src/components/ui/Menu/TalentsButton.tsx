import { useGameStore } from "@/stores/GameState";
import { useTalentTreeStore } from "@/stores/talentTreeState";
import { eventEmitter } from "@/utils/Eventemitter";
import { AspectRatio, Box, Button, Container, Flex, Icon, Text } from "@chakra-ui/react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { RiCopperCoinLine } from "react-icons/ri";






export default function TalentsButton() {
    const { talents } = useTalentTreeStore();
    const { currency } = useGameStore();
    const ref = useRef(null);

    const goToStore = useCallback(() => {
        eventEmitter.emit('changeRoute', { route: '/talentTree' });
    }, []);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (ref.current) {
            const { width, height } = ref.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, []);

    const stars = useMemo(() => {
        const { width, height } = dimensions;
        const normalAmount = 20; // 1.7 is 1920/1080 ratio
        const starAmount = Math.floor((width / height) * (normalAmount))
        const tempStars = [] as { x: number; y: number; id: string, opacity: number, animationDelay: string }[];

        // Divide into grid
        const padding = 5;
        const areaToPlaceWithin = 5
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

    const talentsAvailableToBuy = useMemo(() => {
        return talents.reduce((acc, talent) => {
            if (talent.currentLevel >= talent.levels) return acc;
            if (talent.cost > currency) return acc;
            return acc + 1;
        }, 0);
    }, [talents]);

    return (
        <Button ref={ref} pos={"relative"} bg={"galaxyBlue"}
            height={"150px"}
            onClick={goToStore}
            boxShadow={
                "inset 0px 0px 4px 3px rgba(0, 0, 0, 0.5), inset 0px 0px 8px 2px rgba(0, 0, 0, 0.7)"
                //"inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(0, 0, 0, 0.5)"
            }
        >

            {stars.map((star, index) => (
                <Box key={star.id} pos={"absolute"} top={star.y} left={star.x}
                    width={"4px"} height={"4px"} bg={"white"} borderRadius={"50%"}
                    opacity={star.opacity}
                    animation={"starPulse 8s infinite, starMovement 7s infinite"}
                    animationDelay={star.animationDelay}
                    filter={index % 2 === 0 ? "blur(1px)" : "blur(3px)"}
                />
            ))}

            <Box
                bg={"galaxyPurple"}
                style={{
                    animation: "moveMask 30s linear infinite",
                    width: "100%", height: "100%", opacity: 0.5,
                    position: "absolute", top: 0, left: 0,
                    mask: "url('/assets/galaxy/noise.png') luminance",
                    WebkitMask: "url('/assets/galaxy/noise.png') luminance",
                }} />
            <Flex w={"100%"} height={"100%"} gap={1}
                fontSize={"2xl"} align={"center"} justify={"center"}
                zIndex={1} color="white"
            >
                <Icon as={RiCopperCoinLine} color="gold" height={"0.8em"} width={"0.8em"} />
                <Flex height={"100%"} pos={"relative"} align={"center"} justify={"center"}>
                    <Flex align={"center"} justify={"center"} height={"100%"}>
                        <p>Talent Tree</p>
                    </Flex>
                    <Box pos={"absolute"} top={"50%"} right={0} m={0}
                        translate={"calc(100% + 0.5em)  -50%"}
                        bg={"tomato"}
                        height={"1.2em"}
                        aspectRatio={"1/1"}
                        borderRadius={"md"}
                        pointerEvents={"none"}
                        fontSize={"0.7em"}
                    >
                        <AspectRatio ratio={1 / 1}>
                            <p>{talentsAvailableToBuy}</p>
                        </AspectRatio>
                    </Box>
                </Flex>

            </Flex>
        </Button>
    )
}