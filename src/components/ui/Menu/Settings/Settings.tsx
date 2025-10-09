import { CloseButton, Dialog, Flex, Tabs } from "@chakra-ui/react";
import { IoSettings } from "react-icons/io5";
import { LuAudioLines } from "react-icons/lu";
import GeneralSettings from "./General";
import SoundSettings from "./Sound";


export default function Settings({ children }: { children?: React.ReactNode }) {
    return (
        <>
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    {children}
                </Dialog.Trigger>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Body >
                            <SettingsContent />
                        </Dialog.Body>
                        <Dialog.Footer />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    );
}

export function SettingsContent() {
    return (
        <Tabs.Root defaultValue="general">
            <Flex justify={"space-between"} align={"center"} mb={4}>
                <Tabs.List w={"80%"} >
                    <Tabs.Trigger value="general">General <IoSettings /></Tabs.Trigger>
                    <Tabs.Trigger value="audio">Audio <LuAudioLines /></Tabs.Trigger>
                    <Tabs.Indicator />
                </Tabs.List>
                <Dialog.CloseTrigger asChild pos={"relative"} right={0} top={1}>
                    <CloseButton size="sm" width="auto" />
                </Dialog.CloseTrigger>
            </Flex>
            <Tabs.Content value="general">
                <GeneralSettings />
            </Tabs.Content>
            <Tabs.Content value="audio">
                <SoundSettings />
            </Tabs.Content>
        </Tabs.Root>
    );
}