import { type Powerup } from "@/components/Game/Powerups/PowerupList";
import { usePowerupStore, type activePowerup } from "@/stores/PowerupState";
import { Container, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProgressBar } from "../../Utils/Progressbar";



export default function PowerupsUI() {
    const { powerups } = usePowerupStore();

    return (
        <Flex position="absolute" top={5} right={"50%"} transform={"translateX(50%)"} zIndex={10} pointerEvents="none">
            {powerups.map(powerup => (
                <PowerupCard key={ powerup.name} powerup={powerup} />
            ))}
        </Flex>
    );
}

export function PowerupCard({ powerup }: { powerup: activePowerup | Powerup }) {
    const [progress, setProgress] = useState(100);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev - 100 / (powerup.duration! / 100);
                if (newProgress <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return newProgress;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [powerup.duration]);

    return (
        <Container variant={"normal"} direction="column" alignItems="center">
            <img src={powerup.icon} alt={powerup.name} title={powerup.name} style={{ width: 50, height: 50 }} />
            <Text>{powerup.name}</Text>
            <ProgressBar value={progress} />
        </Container>
    );
}