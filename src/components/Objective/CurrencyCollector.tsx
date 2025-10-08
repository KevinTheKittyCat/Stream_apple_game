import { useEventEmitter } from "@/hooks/useEventEmitter";
import { useTick } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import Text from "../Canvas/Text";
import useAutoMove from "../Player/useAutoMove";
//import { Text } from "pixi.js";



export function CurrencyCollector() {
    const [currencyCol, setCurrencyCol] = useState([]);
    const addCurrency = useCallback((currency) => {
        setCurrencyCol((prev) => [...prev, currency]);
    }, []);

    const removeCurrency = useCallback((currency) => {
        setCurrencyCol((prev) => prev.filter((c) => c !== currency));
    }, []);

    useEventEmitter("collectedObjective", (objective) => {
        addCurrency({ ...objective, id: crypto.randomUUID() });
    });


    return (
        <>
            {currencyCol.map((currency) => (
                <CurrencyItem key={currency.id} currency={currency} remove={removeCurrency} />
            ))}
        </>
    );
}

function CurrencyItem({ currency, remove }: { currency: any, remove: (currency: any) => void }) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            remove(currency);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    const { ref } = useAutoMove({
        targetPos: {
            y: () => currency.y - 50
        },
        maxVelocity: 1,
        normalizationFactor: 0.01, // Factor to normalize distance for smoother movement
        easingFactor: 0.1,
    });

    useTick(({ deltaTime }) => {
        if (ref.current) {
            ref.current.alpha = Math.max(ref.current.alpha - 0.01 * deltaTime, 0);
        }
    });

    return <Text
        ref={ref}
        stroke={{ color: '#4a1850', width: 5, join: 'round' }}
        x={currency.x}
        y={currency.y}
        style={{
            fill: '#ffffff',
            stroke: { color: '#000000ff', width: 3, join: 'round' }
        }}
    > {currency.type.value}</Text>;
}