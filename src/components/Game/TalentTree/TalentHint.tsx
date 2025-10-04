import { outer, inner } from "./Talent";
import AdaptableGraphic from "@/components/Canvas/AdaptableGraphic";
import Text from "@/components/Canvas/Text";
import type { TalentType } from "./Settings/all";

type TalentHintTypes = {
    talent: TalentType;
    x: number;
    y: number;
};

export default function TalentHint({ talent, x, y }: TalentHintTypes) {

    return (
        <AdaptableGraphic //size={{ width: 150, height: 150 }}
            rounded={5}
            color={"#6c507686"}//"#D6BBC0" // NEED MORE TEXTURE VARIATION
            stroke={{ color: "#EFBF04", width: 2 }}
            padding={10}
            x={x + outer + inner / 2 + 5}
            y={y}
            anchor={{ x: 0, y: 0.5 }}
        >
            <Text
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
            >
                {talent.description}
            </Text>
            <Text
                style={{
                    fontFamily: 'Arial',
                    fontSize: 12,
                    fill: '#ffffff',
                    stroke: '#000000',
                    //strokeThickness: 4,
                    //dropShadow: true,
                    wordWrap: true,
                    wordWrapWidth: 140 - 5,
                }}
            >
                {`Level: ${talent.currentLevel}/${talent.levels}`}
            </Text>
        </AdaptableGraphic>
    )
}
