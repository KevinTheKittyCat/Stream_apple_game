import { useSettingsStore } from "@/stores/Settings";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";



export default function SoundSettings() {
    const sound = useSettingsStore((state) => state.sound);
    const updateSoundSettings = useSettingsStore((state) => state.updateSoundSettings);
    const { masterVolume, musicVolume, effectsVolume, ambientVolume } = sound;

    const updateVolume = useCallback((type: keyof typeof sound, value: number) => {
        updateSoundSettings({ [type]: value });
    }, [updateSoundSettings]);

    const inputs = useMemo(() => [
        { label: "Master", value: masterVolume, type: "masterVolume" },
        { label: "Music", value: musicVolume, type: "musicVolume" },
        { label: "Effects", value: effectsVolume, type: "effectsVolume" },
        { label: "Ambient", value: ambientVolume, type: "ambientVolume" },
    ], [masterVolume, musicVolume, effectsVolume, ambientVolume]);

    return (
        <Flex gap={1} direction="column" align="start" width="100%">
            <Text fontWeight="bold">Audio Settings</Text>
            <Box padding={4} borderWidth={1} borderRadius="md" width="100%" bg="gray.800" color="white">
                <Stack gap={4} width="100%" align={"start"}>
                    {inputs.map((input) => (
                        <Flex key={input.type} align="center" gap={4} width="100%">
                            <Text width="100px" textAlign="center">{input.label}</Text>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={input.value}
                                onChange={(e) => updateVolume(input.type, parseInt(e.target.value))}
                                style={{ width: '100%' }}
                            />
                            <Text width="100px" textAlign="center">{input.value}</Text>
                        </Flex>
                    ))}
                </Stack>
            </Box>
        </Flex>
    );
}