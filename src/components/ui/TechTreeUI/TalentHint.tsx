import { useTalentTreeStore } from "@/stores/talentTreeState";
import { Flex, Image } from "@chakra-ui/react";



export default function TalentHint() {
    const { hoveringTalent, talents } = useTalentTreeStore();
    const talent = talents.find(t => t.id === hoveringTalent?.id);
    if (!talent) return null;
    return (
        <Flex direction={"column"} align={"center"} gap={1} p={2}
            style={{
                position: 'absolute',
                top: hoveringTalent.y,
                left: hoveringTalent.x,
                backgroundColor: "#6c507686",
                borderRadius: '8px',
                pointerEvents: 'none',
                maxWidth: '200px',
                border: '2px solid #EFBF04',
                translate: '-0% -50%',
                backdropFilter: 'blur(5px)',
                fontSize: '1.2em',
            }}>
            <p>
                {talent.description}
            </p>
            {talent.effects.map((effect, index) => (
                <p key={index} style={{ fontSize: '1.4em' }}>
                    <strong>
                        {effect?.add && `+${effect.add} `}
                        {effect?.minus && `-${effect.minus} `}
                        {effect?.multiply && `+ ${Math.round(effect.multiply * 100 - 100)}% `}
                        {effect?.set && `Set to ${effect.set} `}
                    </strong>
                </p>
            ))}
            <Flex width={"100%"} alignItems={"center"} justifyContent={"space-evenly"} gap={1} mt={1}>
                {talent.levels > talent.currentLevel &&
                    <Flex alignItems={"center"} gap={1}>
                        <Image h={"1em"} src={"/assets/fruits/Apple.png"} alt={talent.description} />
                        <p>{talent.cost}</p>
                    </Flex>
                }
                <p><strong>{talent.currentLevel} / {talent.levels}</strong></p>
            </Flex>
        </Flex>
    );
}
