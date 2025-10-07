import { basePath } from "@/config/constants";
import { Sprite } from "../Canvas/Sprite";

export default function Tophat() {
    const scale = 1.5; // Adjust the scale as needed
    return (
        <Sprite
            texture={`${basePath}/assets/Tophat.png`}
            anchor={0.5}
            x={0}
            y={-20 * scale}
            scale={scale}
        />
    );
}