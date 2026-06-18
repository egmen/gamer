import { makeAutoObservable } from "mobx";

import { play, unlockSounds, PlayType, SoundSet } from "./sound/playAudio";
import settings from "./settings";
import { ThemeKey } from "./themes";
import enableWakeLock from "./wakeLock";

export type Phase = "idle" | "running" | "finished";
/** Кратковременная (или, для финиша, постоянная) заливка фона. */
export type BgFlash = "none" | "start" | "warn" | "finish";

type SyntheticEvent = { stopPropagation: () => void };

const FLASH_MS = 700;

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, Math.round(value)));
}

class Timer {
  phase: Phase = "idle";

  /** Прошедшие целые секунды текущего хода. */
  elapsedSec = 0;

  bg: BgFlash = "none";

  settingsOpen = false;

  private intervalId = 0;

  private flashTimeoutId = 0;

  private warned = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /** Сколько секунд осталось до конца хода. */
  get timeLeft(): number {
    if (this.phase === "idle") {
      return settings.moveTime;
    }
    if (this.phase === "finished") {
      return 0;
    }
    return Math.max(0, settings.moveTime - this.elapsedSec);
  }

  private playSound(type: PlayType): void {
    // Набор «off» обрабатывается внутри play() как тишина.
    play(type);
  }

  private flash(kind: BgFlash): void {
    this.bg = kind;
    if (kind === "start" || kind === "warn") {
      clearTimeout(this.flashTimeoutId);
      this.flashTimeoutId = window.setTimeout(this.clearFlash, FLASH_MS);
    }
  }

  private clearFlash(): void {
    // На финише фон загорается и держится до следующего старта.
    if (this.phase !== "finished") {
      this.bg = "none";
    }
  }

  private tick(): void {
    this.elapsedSec += 1;
    const remaining = settings.moveTime - this.elapsedSec;
    if (!this.warned && remaining <= settings.warningTime && remaining > 0) {
      this.warned = true;
      this.playSound(PlayType.WARNING);
      this.flash("warn");
    }
    if (this.elapsedSec >= settings.moveTime) {
      clearInterval(this.intervalId);
      this.intervalId = 0;
      this.phase = "finished";
      this.bg = "finish";
      this.playSound(PlayType.FINISH);
    }
  }

  /** Тап в любом месте экрана — запуск/перезапуск хода с начала. */
  restart(): void {
    unlockSounds();
    enableWakeLock();
    clearInterval(this.intervalId);
    clearTimeout(this.flashTimeoutId);
    this.warned = false;
    this.elapsedSec = 0;
    this.phase = "running";
    this.playSound(PlayType.START);
    this.flash("start");
    this.intervalId = window.setInterval(this.tick, 1000);
  }

  // --- Обработчики меню (настройки) ---

  openSettings(event: SyntheticEvent): void {
    event.stopPropagation();
    this.settingsOpen = true;
  }

  closeSettings(event: SyntheticEvent): void {
    event.stopPropagation();
    this.settingsOpen = false;
  }

  /** Гасит всплытие тапов внутри панели настроек. */
  stopEvent(event: SyntheticEvent): void {
    event.stopPropagation();
  }

  stepMove(delta: number): void {
    const value = clamp(settings.moveTime + delta, 10, 180);
    settings.moveTime = value;
    settings.warningTime = Math.min(settings.warningTime, value - 2);
    if (this.phase !== "running") {
      this.phase = "idle";
      this.elapsedSec = 0;
    }
  }

  stepWarn(delta: number): void {
    settings.warningTime = clamp(
      settings.warningTime + delta,
      3,
      Math.min(60, settings.moveTime - 2),
    );
  }

  pickTheme(theme: ThemeKey): void {
    settings.theme = theme;
  }

  pickSoundSet(soundSet: SoundSet): void {
    settings.soundSet = soundSet;
  }

  resetDefaults(event: SyntheticEvent): void {
    event.stopPropagation();
    clearInterval(this.intervalId);
    clearTimeout(this.flashTimeoutId);
    this.intervalId = 0;
    settings.moveTime = 60;
    settings.warningTime = 10;
    settings.theme = "midnight";
    settings.soundSet = "chgk";
    this.phase = "idle";
    this.elapsedSec = 0;
    this.bg = "none";
    this.warned = false;
  }
}

export default new Timer();
