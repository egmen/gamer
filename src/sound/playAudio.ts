import settings from "../settings";

export enum PlayType {
  START,
  FINISH,
  WARNING,
}

/**
 * Доступные наборы звуков:
 * - `chgk`     — синтез гармоник из `CHGK_SOUNDS` (тоны «Что? Где? Когда?»), по умолчанию;
 * - `standard` — простые бипы (набор из исходного дизайна);
 * - `off`      — звук отключён.
 */
export type SoundSet = "standard" | "chgk" | "off";

export const SOUND_SETS: { key: SoundSet; name: string }[] = [
  { key: "standard", name: "Стандарт" },
  { key: "chgk", name: "ЧГК" },
  { key: "off", name: "Выкл" },
];

/**
 * Набор «ЧГК» — синтез через Web Audio API (без аудиофайлов).
 *
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

const CHGK_SOUNDS: Record<PlayType, SoundSpec> = {
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

function playChgk(type: PlayType): void {
  const spec = CHGK_SOUNDS[type];
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

/**
 * Набор «Стандарт» — простые бипы из исходного дизайна. Используют один общий
 * AudioContext (переиспользуется между сигналами), его нужно «разбудить»
 * пользовательским жестом — см. unlockSounds().
 */
let standardCtx: AudioContext | null = null;

function standardContext(): AudioContext {
  if (!standardCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    standardCtx = new Ctor();
  }
  return standardCtx;
}

function beep(
  freq: number,
  dur: number,
  type: OscillatorType,
  when = 0,
  gain = 0.32,
): void {
  const ac = standardContext();
  if (ac.state === "suspended") {
    ac.resume();
  }
  const t = ac.currentTime + when;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(ac.destination);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.03);
}

const STANDARD: Record<PlayType, () => void> = {
  [PlayType.START]: () => {
    beep(587, 0.12, "sine", 0);
    beep(880, 0.16, "sine", 0.13);
  },
  [PlayType.WARNING]: () => {
    beep(740, 0.14, "square", 0);
    beep(740, 0.14, "square", 0.2);
  },
  [PlayType.FINISH]: () => {
    beep(196, 0.5, "sawtooth", 0);
    beep(165, 0.6, "sawtooth", 0.18);
  },
};

function playStandard(type: PlayType): void {
  STANDARD[type]();
}

/**
 * Снимает блокировку автозапуска: вызывается из обработчика пользовательского
 * жеста (тапа), чтобы отложенные сигналы набора «Стандарт» (предупреждение,
 * финиш) могли проиграться без участия пользователя — важно для iOS/мобильных.
 */
export function unlockSounds(): void {
  const ac = standardContext();
  if (ac.state === "suspended") {
    ac.resume();
  }
}

export default function playAudio(type: PlayType): void {
  if (settings.soundSet === "off") {
    return;
  }
  if (settings.soundSet === "standard") {
    playStandard(type);
  } else {
    playChgk(type);
  }
}

export function play(type: PlayType): void {
  playAudio(type);
}
