import Graphic from "@/components/Canvas/Graphic";
import { Group } from "@/components/Canvas/Group";
import { usePortalStore } from "@/stores/PortalState";
import type { TalentType } from "@/stores/talentTreeState";
import { outer, inner, overlap } from "./Talent";

type TalentHintTypes = {
    talent: TalentType;
    x: number;
    y: number;
};

export default function TalentHint({ talent, x, y }: TalentHintTypes) {
    const { portalRef } = usePortalStore();
    if (!portalRef?.current) return null;
    return (
        <Group x={x + inner * 2 + 10} y={y}>
            <Graphic // Background Rectangle
                //size={{ width: 150, height: 150 }}
                autoSize
                rounded={5}
                color={"#6c507686"}//"#D6BBC0" // NEED MORE TEXTURE VARIATION
                stroke={{ color: "#EFBF04", width: 2 }}
            >
                <pixiText
                    text={talent.description}
                    x={5}
                    y={5}
                    style={{
                        fontFamily: 'Arial',
                        fontSize: 14,
                        fill: '#ffffff',
                        stroke: '#000000',
                        //strokeThickness: 4,
                        //dropShadow: true,
                        wordWrap: true,
                        wordWrapWidth: 140 - 5,
                    }}
                />
            </Graphic>
        </Group>
    )
}
