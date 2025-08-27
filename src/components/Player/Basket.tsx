import { useMemo } from "react";
import { Group } from "../Canvas/Group";
import { Sprite } from "../Canvas/Sprite";

export default function Basket() {
    const scale = 0.3; // Adjust the scale as needed
    const centerBasketAmount = 25;
    const widthOfBasketLeft = 96

    const centerBasketArray = useMemo(() => {
        return Array.from({ length: centerBasketAmount }, (_, i) => (
            <Sprite
                key={i}
                texture={`/assets/basket/BasketMiddle.png`}
                x={i * 25 + widthOfBasketLeft}
            />
        ));
    }, [centerBasketAmount]);

    return (
        <Group
            y={-140 * scale}
            x={((-centerBasketAmount * 25) * 0.5 - widthOfBasketLeft) * scale}
            scale={scale}
        >
            <Sprite
                texture={"/assets/basket/BasketLeft.png"}
                x={0}
            />
            {centerBasketArray}
            <Sprite

                texture={"/assets/basket/BasketRight.png"}
                x={(centerBasketAmount * 25) + widthOfBasketLeft}
            />
        </Group>
    );
}