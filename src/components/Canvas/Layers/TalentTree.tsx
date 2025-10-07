import { Layer } from "@/components/Canvas/Layer";
import { useApplication } from "@pixi/react";

import TalentTreeBackground from "@/components/Background/TalentTreeBackground";
import NewTalentTree from "@/components/Game/TalentTree/NewTalentTree";

import { CustomViewport } from "@/components/Canvas/CustomViewport";


export default function TalentTree({ visible = true }: { visible?: boolean }) {
    const { isInitialised } = useApplication();

    if (!isInitialised) return null;
    return (
        <>
            <Layer
                visible={visible}
                eventMode="passive"
            >
                <TalentTreeBackground />
                <CustomViewport>
                    <NewTalentTree visible={visible} />
                </CustomViewport>
            </Layer>
        </>
    );
}

