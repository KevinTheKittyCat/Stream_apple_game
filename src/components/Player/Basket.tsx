import { basePath } from "@/config/constants";
import { useTalentTreeStore } from "@/stores/talentTreeState";
import { useMemo } from "react";
import { Group } from "../Canvas/Group";
import { Sprite } from "../Canvas/Sprite";
import { getTalentEffect } from "../UtilFunctions/talents";

export default function Basket() {
    const { talents } = useTalentTreeStore(); 
    const scale = 0.3; // Adjust the scale as needed
    const centerBasketAmount = useMemo(() => getTalentEffect(10, "basketSize"), [talents]);
    const widthOfBasketLeft = 96

    const centerBasketArray = useMemo(() => {
        return Array.from({ length: centerBasketAmount }, (_, i) => (
            <Sprite
                key={i}
                texture={`${basePath}/assets/basket/BasketMiddle.png`}
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
                texture={`${basePath}/assets/basket/BasketLeft.png`}
                x={0}
            />
            {centerBasketArray}
            <Sprite
                texture={`${basePath}/assets/basket/BasketRight.png`}
                x={(centerBasketAmount * 25) + widthOfBasketLeft -2}
            />
        </Group>
    );
}