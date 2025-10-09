import { useEventEmitter } from "@/hooks/useEventEmitter";
import { useSettingsStore } from "@/stores/Settings";
import { useCallback } from "react";
import MusicTrack from "./Music/Apple_track";
import { collectSound } from "./Sounds/collectSound";

export default function SoundListener() {
    //const [masterVolume, setMasterVolume] = useState(100);
    const sound = useSettingsStore((state) => state.sound);
    const { masterVolume, effectsVolume } = sound;

    const onCollectedObjective = useCallback((data: any, volume: number = 100) => {
        const freq = (data.type.value > 0 ? 1800 : 800) + Math.random() * 400; // Higher pitch for positive, lower for negative
        collectSound(masterVolume * (effectsVolume / 100), freq);
    }, [masterVolume, effectsVolume]);

    const onCoinCollected = useCallback((data: any, volume: number = 100) => {
        // Fix the AudioContext creation
        console.log("Coin collected sound played");
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const baseVolume = 100;
        // Calculate final volume - reduced base volume to match plink better
        const finalVolume = (0.05 * (masterVolume / 100) * (baseVolume / 100));

        // Create gain node with calculated volume
        const gainNode = context.createGain();

        const oscillator = new OscillatorNode(context, {
            type: 'triangle',
            frequency: 1000, // Starting frequency
        });

        // Remove unused envelope node and connect directly
        // Frequency envelope (quick drop)
        oscillator.frequency.setValueAtTime(1800, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(700, context.currentTime + 0.2);

        oscillator.detune.value = 100; // Detune by 1 semitone

        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(finalVolume, context.currentTime + 0.01); // Quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15); // Quick decay

        // Connect the audio graph properly
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);

        // Clean up the audio context
        setTimeout(() => {
            context.close();
        }, 500);
    }, [masterVolume]);

    // Make sure you're listening to the right event
    useEventEmitter('collectedObjective', (data) => onCollectedObjective(data));
    //useEventEmitter('coinCollected', onCoinCollected);
    return <MusicTrack />;
}