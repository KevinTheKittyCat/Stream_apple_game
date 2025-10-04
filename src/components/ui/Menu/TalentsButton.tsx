import { useGameStore } from "@/stores/GameState";
import { useTalentTreeStore } from "@/stores/talentTreeState";
import { useWindowStore } from "@/stores/WindowState";
import { eventEmitter } from "@/utils/Eventemitter";
import { AspectRatio, Box, Button, Flex, Icon } from "@chakra-ui/react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { RiCopperCoinLine } from "react-icons/ri";




type StarType = {
    x: number;
    y: number;
    id: string,
    opacity: number,
    animationDelay: string
};

export default function TalentsButton() {
    const { talents } = useTalentTreeStore();
    const { currency } = useGameStore();
    const { width, height } = useWindowStore();
    const ref = useRef<HTMLButtonElement>(null);

    const goToStore = useCallback(() => {
        eventEmitter.emit('changeRoute', { route: '/talentTree' });
    }, []);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) return;
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
    }, [width, height]);

    const stars = useMemo(() => {
        const { width, height } = dimensions;
        const normalAmount = 5;
        const starAmount = Math.floor((width / height) * (normalAmount))
        const tempStars = [] as StarType[];

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

    const [hover, setHover] = useState(false);

    const RenderStars = useMemo(() => {
        return stars.map((star, index) => {
            return (
                <Star key={star.id} star={star} index={index} hover={hover} />
            )
        })
    }, [stars, hover]);

    return (
        <Button ref={ref} pos={"relative"} bg={"galaxyBlue"}
            variant={"menuButton"}
            height={"150px"}
            width={"100%"}
            onClick={goToStore}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            transition={"box-shadow 0.3s ease-in-out"}
            overflow={"hidden"}
            _icon={{
                transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out",
                filter: "drop-shadow(3px 3px 0px rgba(0, 0, 0, 0.7))"
            }}
            _hover={{
                _icon: {
                    //transform: "rotate(20deg)",
                    filter: "drop-shadow(1px 3px 0px rgba(0, 0, 0, 0.7))"
                    //filter: "drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.5))"
                }
            }}
            border={"none"}
            boxShadow={
                //"inset 0 7px 4px #000000cc"
                //hover ?
                "1px 1px 0px rgba(255,255,255,.3), inset 1px 1px 0px rgba(0,0,0,.7) "
                //" 0px -1px 0px rgba(255,255,255,.3), inset 0px 1px 2px rgba(0,0,0,.7), "
                //"1px 0px 0px rgba(255,255,255,.3), inset -1px 0px 2px rgba(0,0,0,.7), " +
                //" -1px 0px 0px rgba(255,255,255,.3), inset 1px 0px 2px rgba(0,0,0,.7) "
                //"inset 0 1px 1px rgba(0, 0, 0, 0.6), inset 0 -1px 1px rgba(255, 255, 255, 0.4), 0 2px 5px rgba(0, 0, 0, 0.5)"
                //"inset 0px 0px 4px 3px rgba(0, 0, 0, 0.5), inset 0px 0px 8px 2px rgba(0, 0, 0, 0.7)"
                //: "inset 2px 2px 2px rgba(0, 0, 0, 0.8), inset -2px -2px 1px rgba(0, 0, 0, 0.8)"
            }>

            {RenderStars}
            < Box
                bg={"galaxyPurple"}
                style={{
                    animation: "moveMask 60s linear infinite",
                    width: "100%", height: "100%", opacity: 0.5,
                    position: "absolute", top: 0, left: 0,
                    mask: "url('/assets/galaxy/noise.png') luminance",
                    WebkitMask: "url('/assets/galaxy/noise.png') luminance",
                }}
            />
            < Flex w={"100%"} height={"100%"} gap={1}
                fontSize={"2xl"} align={"center"} justify={"center"}
                zIndex={1} color="white"
            >
                <Flex pos={"relative"} align={"center"} justify={"center"}>
                    <Icon as={RiCopperCoinLine}
                        height={"4em"} width={"4em"}
                    />
                    <Box pos={"absolute"} top={0} right={0} m={0}
                        bg={"tomato"}
                        height={"1.4em"}
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
            </Flex >
        </Button >
    )
}

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
    if (index === 0) console.log("reRendering", animation);
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