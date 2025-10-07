import { useGameStore } from "@/stores/GameState";
import { useTalentTreeStore } from "@/stores/talentTreeState";
import { eventEmitter } from "@/utils/Eventemitter";
import { AspectRatio, Box, Button, Flex, Icon } from "@chakra-ui/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { RiCopperCoinLine } from "react-icons/ri";
import HTMLGalaxyBackground from "../TechTreeUI/HTMLGalaxyBackground";





export default function TalentsButton() {
    const talents = useTalentTreeStore((state) => state.talents);
    const currency = useGameStore((state) => state.currency);
    const ref = useRef<HTMLButtonElement>(null);

    const goToStore = useCallback(() => {
        eventEmitter.emit('changeRoute', { route: '/talentTree' });
    }, []);

    const talentsAvailableToBuy = useMemo(() => {
        return talents.reduce((acc, talent) => {
            if (talent.currentLevel >= talent.levels) return acc;
            if (talent.cost > currency) return acc;
            return acc + 1;
        }, 0);
    }, [talents]);

    const [hover, setHover] = useState(false);

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

            <HTMLGalaxyBackground position={"absolute"} container={ref} hover={hover} />
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
