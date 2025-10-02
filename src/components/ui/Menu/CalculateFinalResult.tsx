import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { RiCopperCoinLine } from "react-icons/ri";





export default function CalculateFinalResult() {
    const { lastScore, currency } = useGameStore();
    const [score, setScore] = useState(0);
    const [curr, setCurr] = useState(currency - lastScore);

    useEffect(() => {
        const waitForRender = setTimeout(() => {
            setScore(lastScore);
            setCurr(currency);
        }, 10);

        return () => clearTimeout(waitForRender);
    }, [lastScore, currency]);


    return (
        <Flex w={"100%"} direction={"column"} align={"end"} pointerEvents={"all"}>
            <Flex w={"100%"} gap={2} align={"center"} justify={"space-between"} className="score"
                fontSize={"1rem"}
                borderBottom={"1px dashed rgba(255, 255, 255, 0.4)"}
                marginBottom={1}
            >
                {/*<img src="/assets/apple/Apple.png" alt="Score Icon" style={{ width: "1em", height: "1em" }} />*/}
                <RiCopperCoinLine color="gold" />
                {/* Score display can be implemented here */}
                <div className="counter" style={{ "--num": score ?? 0 }} />
            </Flex>
            <Flex w={"100%"} gap={2} align={"center"} justify={"space-between"} className="score" fontSize={"1rem"}
                borderBottom={"2px solid rgba(255, 255, 255, 0.4)"}
                marginTop={1}>
                <RiCopperCoinLine color="gold" />
                <div className="counter" style={{ "--num": curr, transitionDelay: "1s" }} />
            </Flex>
        </Flex>
    );
}
