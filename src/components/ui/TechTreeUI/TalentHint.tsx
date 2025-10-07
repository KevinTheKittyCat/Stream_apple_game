import { basePath } from "@/config/constants";
import { useTalentTreeStore } from "@/stores/talentTreeState";
import { Flex, Image } from "@chakra-ui/react";
import { useMemo } from "react";



export default function TalentHint() {
    const { hoveringTalent, talents } = useTalentTreeStore();
    const talent = useMemo(() => talents.find(t => t.id === hoveringTalent?.id), [hoveringTalent, talents]);

    if (!talent) return null;
    return (
        <Flex direction={"column"} align={"center"} gap={1} p={4}
            style={{
                position: 'absolute',
                top: hoveringTalent?.y || hoveringTalent?.position?.y,
                left: hoveringTalent?.x || hoveringTalent?.position?.x,
                backgroundColor: "#6c507686",
                borderRadius: '8px',
                pointerEvents: 'none',
                maxWidth: '250px',
                border: '2px solid #EFBF04',
                translate: '-0% -50%',
                backdropFilter: 'blur(5px)',
                fontSize: '1.2em',
            }}>
            <p style={{ fontSize: '1.2em', width: '100%', textAlign: 'left' }}>
                <strong>{talent?.title}</strong>
            </p>
            <p style={{ textAlign: 'left' }}>
                {talent.description}
            </p>
            {talent.effects.map((effect, index) => (
                <Flex style={{ fontSize: '1.4em' }} key={index} width={"100%"} alignItems={"center"} justifyContent={"center"}>
                    {effect?.prefix && typeof effect.prefix === "function" ? <effect.prefix /> : null}
                    <p>
                        <strong>
                            {effect?.prefix && typeof effect.prefix === "string" ? effect.prefix : null}
                            {effect?.add && `${effect.add}`}
                            {effect?.minus && `${effect.minus}`}
                            {effect?.multiply && `${Math.round(effect.multiply * 100 - 100)}`}
                            {effect?.divide && `${Math.round(effect.divide * 100 - 100)}`}
                            {effect?.set && `Set to ${effect.set} `}
                            {effect?.suffix && typeof effect.suffix === "string" ? effect.suffix : null}
                        </strong>
                    </p>
                    {effect?.suffix && typeof effect.suffix === "function" ? <effect.suffix /> : null}
                </Flex>
            ))}
            <Flex width={"100%"} alignItems={"center"} justifyContent={"space-evenly"} gap={1} mt={1}>
                {talent.levels > talent.currentLevel &&
                    <Flex alignItems={"center"} gap={1}>
                        <Image h={"1em"} src={`${basePath}/assets/fruits/Apple.png`} alt={talent.description} />
                        <p>{talent.cost}</p>
                    </Flex>
                }
                <p><strong>{talent.currentLevel} / {talent.levels}</strong></p>
            </Flex>
        </Flex>
    );
}
