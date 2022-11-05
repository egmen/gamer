import { PlayType } from ".";

function getFrequences(type: PlayType): number[] {
  switch (type) {
    case PlayType.START:
    case PlayType.FINISH:
      return [1000, 3000, 5000, 6000, 8000, 10000, 12000, 14000, 16000];
    case PlayType.WARNING:
      return [
        1000,
        2000,
        3000,
        5000,
        6000,
        8000,
        9000,
        10000,
        12000,
        13000,
        14000,
        16000,
      ];
    default:
      throw new Error(`Unexpexted type: ${type}`);
  }
}

export default function playAudio(type: PlayType): void {
  const freq = getFrequences(type);
  const SOUND_DURATION = 1.1;
  const FADE_DURATION = 0.05;
  const audioCtx = new window.AudioContext();
  const gainNode = audioCtx.createGain();
  freq.forEach((fr) => {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(fr, 0);
    oscillator.connect(gainNode);
    oscillator.start(0);
    oscillator.stop(SOUND_DURATION);
  });
  gainNode.gain.setValueAtTime(0, 0);
  gainNode.gain.setTargetAtTime(0.01, 0, FADE_DURATION);
  gainNode.gain.setTargetAtTime(
    0,
    SOUND_DURATION - FADE_DURATION,
    FADE_DURATION
  );
  gainNode.connect(audioCtx.destination);
  setTimeout(() => {
    audioCtx.close();
  }, 2000);
}
