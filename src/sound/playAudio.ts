export enum PlayType {
  START,
  FINISH,
  WARNING,
}

/**
 * Спектр каждого звука снят с исходных mp3 (анализ через DFT/Goertzel):
 * это стабильные по высоте гармонические тоны. Воспроизводим их через
 * OscillatorNode с кастомным PeriodicWave (амплитуды гармоник) и
 * прямоугольной огибающей на GainNode — на слух неотличимо от файла,
 * но без сетевых запросов и зависимостей.
 */
interface SoundSpec {
  /** Основная частота, Гц. */
  fundamental: number;
  /** Амплитуды гармоник: partials[i] — это (i+1)-я гармоника. */
  partials: number[];
  /** Длительность звука, c. */
  duration: number;
}

const SOUNDS: Record<PlayType, SoundSpec> = {
  // f0 = 1024 Гц, доминируют нечётные гармоники (близко к меандру).
  [PlayType.START]: {
    fundamental: 1024,
    partials: [0.205, 0, 0.431, 0, 0.084, 0, 0.188, 0, 0.018],
    duration: 1.11,
  },
  // f0 = 1024 Гц, есть и чётные гармоники (более «насыщенный» тембр).
  [PlayType.FINISH]: {
    fundamental: 1024,
    partials: [0.119, 0.292, 0.207, 0, 0.088, 0.105, 0.073, 0, 0, 0.005],
    duration: 1.16,
  },
  // f0 = 2048 Гц (на октаву выше), нечётные гармоники.
  [PlayType.WARNING]: {
    fundamental: 2048,
    partials: [0.152, 0, 0.27, 0, 0.0345, 0, 0.059],
    duration: 1.01,
  },
};

const ATTACK = 0.01; // быстрая атака, c
const RELEASE = 0.08; // короткий спад в конце, c
const PEAK_GAIN = 0.2; // громкость (PeriodicWave нормализован к ~1)

function buildWave(ctx: AudioContext, partials: number[]): PeriodicWave {
  // Индекс 0 — постоянная составляющая (DC), оставляем нулём;
  // гармоника n живёт в real[n]/imag[n]. Кладём амплитуду в imag (синус-фаза).
  const real = new Float32Array(partials.length + 1);
  const imag = new Float32Array(partials.length + 1);
  partials.forEach((amp, i) => {
    imag[i + 1] = amp;
  });
  return ctx.createPeriodicWave(real, imag, { disableNormalization: false });
}

export default function playAudio(type: PlayType): void {
  const spec = SOUNDS[type];
  if (!spec) {
    throw new Error(`Unexpected type: ${type}`);
  }

  const ctx = new window.AudioContext();
  const start = ctx.currentTime;
  const end = start + spec.duration;

  const oscillator = ctx.createOscillator();
  oscillator.setPeriodicWave(buildWave(ctx, spec.partials));
  oscillator.frequency.setValueAtTime(spec.fundamental, start);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, start);
  gainNode.gain.linearRampToValueAtTime(PEAK_GAIN, start + ATTACK);
  gainNode.gain.setValueAtTime(PEAK_GAIN, end - RELEASE);
  gainNode.gain.linearRampToValueAtTime(0, end);

  oscillator.connect(gainNode).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(end);
  oscillator.onended = () => {
    ctx.close();
  };
}

export function play(type: PlayType) {
  playAudio(type);
}
