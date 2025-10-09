import { useSettingsStore } from "@/stores/Settings";
import { Button, Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";

export default function MusicTrack() {
    const sound = useSettingsStore((state) => state.sound);
    const { masterVolume, musicVolume } = sound;
    const Synth = useRef(null);
    const FMSynth = useRef(null);
    const AMSynth = useRef(null);
    const Gain = useRef(null);
    const Loops = useRef({});
    const [playing, setPlaying] = useState(false);

    const setVolume = useCallback(() => {
        const gainNode = Gain.current as Tone.Gain;

        const calculatedVolume = (masterVolume / 100) * (musicVolume / 100);
        const shouldPlay = masterVolume * musicVolume > 0;
        const actualVolume = shouldPlay ? calculatedVolume - 1 : -1;
        gainNode.gain.setValueAtTime(actualVolume, Tone.now());
    }, [masterVolume, musicVolume]);

    const setupAudio = async () => {
        const synth = new Tone.PolySynth(Tone.Synth).toDestination();
        const fmSynth = new Tone.FMSynth().toDestination();
        const amSynth = new Tone.AMSynth().toDestination();
        const gainNode = new Tone.Gain(0).toDestination();
        Synth.current = synth;
        FMSynth.current = fmSynth;
        AMSynth.current = amSynth;
        if (!Gain.current) Gain.current = gainNode;
        synth.connect(gainNode);
        fmSynth.connect(gainNode);
        amSynth.connect(gainNode);
        await Tone.start();
        setVolume();
    }


    useEffect(() => {
        if (!Gain.current) return;
        setVolume();
    }, [masterVolume, musicVolume]);

    const startMusic = () => {
        if (!Synth.current || !FMSynth.current || !AMSynth.current) setupAudio();
        console.log("Starting music");
        if (playing) stopMusic();
        setPlaying(true);
        const synth = Synth.current as Tone.PolySynth;
        const fmSynth = FMSynth.current as Tone.FMSynth;
        const amSynth = AMSynth.current as Tone.AMSynth;
        const loops = Loops.current;

        loops.drum = new Tone.Loop((time) => {
            const now = Tone.now();
            synth.triggerAttack("E1", now + 0.2);
            synth.triggerRelease("E1", now + 0.3);
        }, "2n").start(0);

        loops.hiHat = new Tone.Loop((time) => {
            const now = Tone.now();
            amSynth.triggerAttack("F2", now + 0.2);
            amSynth.triggerRelease(now + 0.3);
        }, "1n").start(0);

        loops.chord = new Tone.Loop((time) => {
            const now = Tone.now();
            // bom --- bom --- bom --- bom
            synth.triggerAttackRelease(["B1"], "8n", now + 2.7);
            synth.triggerAttackRelease(["D1"], "8n", now + 3);

            synth.triggerAttackRelease(["D2"], "8n", now + 3.2);
            synth.triggerAttackRelease(["F2"], "8n", now + 3.5);
            synth.triggerAttackRelease(["A2"], "8n", now + 3.7);
            synth.triggerAttackRelease(["D3"], "8n", now + 4);
            // bom --- bom --- bom --- bom

            synth.triggerAttackRelease(["E2"], "8n", now + 4.5);
            synth.triggerAttackRelease(["F2"], "8n", now + 4.7);
            synth.triggerAttackRelease(["A2"], "8n", now + 5);

            synth.triggerAttackRelease(["E2"], "8n", now + 5.5);
            synth.triggerAttackRelease(["F2"], "8n", now + 5.7);
            synth.triggerAttackRelease(["A2"], "8n", now + 6);

            synth.triggerAttackRelease(["B1"], "8n", now + 6.5);
            synth.triggerAttackRelease(["D2"], "8n", now + 6.7);
            synth.triggerAttackRelease(["F2"], "8n", now + 7);
            synth.triggerAttackRelease(["A2"], "8n", now + 7.2);
            synth.triggerAttackRelease(["D3"], "8n", now + 7.5);

            synth.triggerAttackRelease(["F2"], "8n", now + 8);
            synth.triggerAttackRelease(["D2"], "8n", now + 8.2);
            synth.triggerAttackRelease(["B1"], "8n", now + 8.5);
            synth.triggerAttackRelease(["A1"], "8n", now + 8.7);

            synth.triggerAttackRelease(["G1"], "8n", now + 9);
            synth.triggerAttackRelease(["F1"], "8n", now + 9.2);

            synth.triggerAttackRelease(["B1"], "8n", now + 9.5);
            synth.triggerAttackRelease(["D1"], "8n", now + 9.7);
        }, 10).start(0);

        Tone.getTransport().start();
        Tone.getTransport().bpm.value = 90;
    }

    const stopMusic = () => {
        const synth = Synth.current as Tone.PolySynth;
        const fmSynth = FMSynth.current as Tone.FMSynth;
        const amSynth = AMSynth.current as Tone.AMSynth;
        synth.triggerRelease(Tone.now());
        fmSynth.triggerRelease(Tone.now());
        amSynth.triggerRelease(Tone.now());
        Object.values(Loops.current).forEach(loop => loop.stop().dispose());
        Tone.getTransport().stop();
        Loops.current = {};
        Tone.Time()
        setPlaying(false);
        console.log("Music stopped");
    }

    return <Flex
        top={2}
        right={100}
        position={"fixed"}
        zIndex={1000}
        gap={2}
    >
        <Button
            bg={"blue.600"}
            color={"white"}
            onClick={startMusic}
        >
            Start Music
        </Button>
        <Button
            bg={"blue.600"}
            color={"white"}
            onClick={stopMusic}
        >
            Stop Music
        </Button>
    </Flex>
}