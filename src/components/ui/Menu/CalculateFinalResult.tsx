import type { ScoreType } from "@/stores/GameState";
import { useGameStore } from "@/stores/GameState";
import { Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { RiCopperCoinLine } from "react-icons/ri";




export default function CalculateFinalResult() {
    const lastScore = useGameStore((state) => state.lastScore);
    const currency = useGameStore((state) => state.currency);

    const [score, setScore] = useState({ total: 0 });
    const [curr, setCurr] = useState(currency - lastScore?.total);

    useEffect(() => {
        const waitForRender = setTimeout(() => {
            setScore(lastScore);
            setCurr(currency);
        }, 10);

        return () => clearTimeout(waitForRender);
    }, [lastScore, currency]);

    const scorers = useMemo(() => {
        // @ts-ignore
        return Object.entries(score).filter(([key, v]) => v !== 0 && key !== "total").sort((a, b) => b[1].value - a[1].value);
    }, [score]);

    return (
        <Flex w={"100%"} direction={"column"} align={"end"} pointerEvents={"all"}>
            {scorers.map(([k, v], index) => {
                return <ScorePerObjective key={k} v={v} lastScore={lastScore} currency={currency} index={index} />;
            })}
            <Flex w={"100%"} gap={2} align={"center"} justify={"flex-end"} className="score" fontSize={"1rem"}>
                <div className="counter" style={{ "--num": score?.total ?? 0, transitionDelay: `${scorers.length * 1}s` } as React.CSSProperties} />
            </Flex>
            <Flex w={"100%"} gap={2} align={"center"} justify={"space-between"} className="score" fontSize={"1rem"}
                borderBottom={"2px solid rgba(255, 255, 255, 0.4)"}>
                <RiCopperCoinLine color="gold" />
                <strong><div className="counter" style={{ "--num": curr, transitionDelay: `${scorers.length + 1 * 1}s` } as React.CSSProperties} /></strong>
            </Flex>
        </Flex>
    )
}
function ScorePerObjective({ v, lastScore, currency, index }: { v: any, lastScore: ScoreType, currency: number, index: number }) {
    const [score, setScore] = useState(0);

    useEffect(() => {
        const waitForRender = setTimeout(() => {
            setScore(v.value);
        }, 10);

        return () => clearTimeout(waitForRender);
    }, [lastScore, currency]);

    return (
        <Flex w={"100%"} gap={2} align={"center"} justify={"space-between"} className="score"
            fontSize={"1rem"}
            borderBottom={"1px dashed rgba(255, 255, 255, 0.4)"}
            marginBottom={1}
        >
            {<img src={v.image} alt="Score Icon" style={{ height: "1em" }} />}
            {/* Score display can be implemented here */}
            <Flex align={"center"} w={"100%"} gap={1}>
                <p>{v.amount}</p>
                <p>x</p>
                <p>{v.singleValue}</p>

                <p>=</p>
            </Flex>
            <Flex gap={1} align={"center"} justify={"flex-end"}>
                <div className="counter" style={{
                    "--num": score ?? 0,
                    transitionDelay: `${index * 1}s`,
                    color: score >= 0 ? undefined : "tomato"
                } as React.CSSProperties} />
                <RiCopperCoinLine color="gold" />
            </Flex>

        </Flex >
    );
}

