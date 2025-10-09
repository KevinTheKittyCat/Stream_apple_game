import { useGameStore } from "@/stores/GameState";
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import Dialog from "../../Chakra/Dialog";





export default function GeneralSettings() {
    const setCurrency = useGameStore((state) => state.setCurrency);
    const resetTalents = useGameStore((state) => state.resetTalents);

    const restartGame = useCallback(() => {
        setCurrency(0);
        resetTalents();
    }, [resetTalents, setCurrency]);

    const DialogAction = () => {
        return (<Button onClick={restartGame} bg={"tomato"}>Yes, Restart</Button>)
    }

    const DialogContent = () => {
        return (<div>Are you sure you want to restart the game? This will reset your currency and talents.</div>)
    }

    return (
        <Flex gap={1} direction="column" align="start" width="100%">
            <Text fontWeight="bold">Game Progress</Text>
            <Box padding={4} borderWidth={1} borderRadius="md" width="100%" bg="gray.800" color="white">
                <Stack gap={4} width="100%" align={"start"}>
                    <Dialog
                        cancelable
                        content={<DialogContent />}
                        actions={<DialogAction />}
                        title="Restart Game?"
                    >
                        <Button bg="tomato" color="white">Reset Game</Button>
                    </Dialog>
                </Stack>
            </Box>
        </Flex>
    );
}