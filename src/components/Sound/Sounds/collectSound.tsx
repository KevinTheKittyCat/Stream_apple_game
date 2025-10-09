export const collectSound = (volume: number = 100, frequency: number = 1800) => {
    const context = new (window.AudioContext || window?.webkitAudioContext)();
    const baseVolume = 100;

    // Calculate final volume based on master volume and function volume
    const finalVolume = (0.05 * (volume / 100) * (baseVolume / 100));

    // Create gain node with calculated volume
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(finalVolume, context.currentTime);

    // Create oscillator for the "plink" sound
    const osc = context.createOscillator();
    osc.type = 'sine'; // Sine wave for a cleaner plink sound

    // Frequency envelope for plink effect (high to low quickly)
    osc.frequency.setValueAtTime(frequency, context.currentTime); // Start high
    osc.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.1); // Drop quickly

    // Volume envelope for plink effect (quick attack, quick decay)
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(finalVolume, context.currentTime + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15); // Quick decay

    // Connect the audio graph
    osc.connect(gainNode);
    gainNode.connect(context.destination);

    // Play the sound
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.2); // Short duration

    // Clean up the audio context
    setTimeout(() => {
        context.close();
    }, 300);
}