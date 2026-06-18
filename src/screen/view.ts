import type { CSSProperties } from "react";

import type { Theme } from "../themes";
import type { Phase, BgFlash } from "../timer";

export interface Dot {
  key: number;
  style: CSSProperties;
}

const RADIUS = 130;

/** Точки по кругу: 1 точка = 1 секунда. Закрашенные = прошедшие. */
export function buildDots(
  theme: Theme,
  total: number,
  warningTime: number,
  elapsedSec: number,
): Dot[] {
  const warnStart = total - warningTime;
  const dotSize = Math.max(4, Math.min(11, Math.round(760 / total)));

  const dots: Dot[] = [];
  for (let i = 0; i < total; i += 1) {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * RADIUS;
    const y = Math.sin(angle) * RADIUS;
    const inWarn = i >= warnStart;
    const filled = i < elapsedSec;
    const fillColor = inWarn ? theme.warn : theme.accent;

    let background: string;
    let opacity: number;
    let boxShadow: string;
    if (filled) {
      background = fillColor;
      opacity = 1;
      boxShadow = `0 0 ${dotSize * 1.3}px ${fillColor}`;
    } else if (inWarn) {
      // Зона предупреждения подсвечена заранее приглушённым тёплым цветом.
      background = theme.warn;
      opacity = 0.26;
      boxShadow = "none";
    } else {
      background = theme.dotBase;
      opacity = 1;
      boxShadow = "none";
    }

    const transform = `translate(-50%,-50%) translate(${x.toFixed(
      2,
    )}px,${y.toFixed(2)}px)`;

    dots.push({
      key: i,
      style: {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: dotSize,
        height: dotSize,
        borderRadius: "50%",
        transform,
        background,
        opacity,
        boxShadow,
        transition:
          "background .3s ease, opacity .3s ease, box-shadow .3s ease",
      },
    });
  }
  return dots;
}

export interface Hint {
  text: string;
  color: string;
}

/** Подпись-статус под цифрами в центре. */
export function getHint(
  phase: Phase,
  bg: BgFlash,
  timeLeft: number,
  warningTime: number,
  theme: Theme,
): Hint {
  if (phase === "running") {
    if (bg === "warn" || timeLeft <= warningTime) {
      return { text: "ВНИМАНИЕ", color: theme.warn };
    }
    return { text: "ХОД ИДЁТ", color: "rgba(255,255,255,.3)" };
  }
  if (phase === "finished") {
    return { text: "ВРЕМЯ ВЫШЛО · ТАП", color: theme.finish };
  }
  return { text: "ТАП — СТАРТ", color: "rgba(255,255,255,.35)" };
}

export interface Overlay {
  color: string;
  opacity: number;
  anim: string;
  stop: string;
}

/** Параметры заливки-вспышки фона по текущей фазе. */
export function getOverlay(bg: BgFlash, theme: Theme): Overlay {
  if (bg === "start") {
    return { color: theme.accent, opacity: 0.3, anim: "none", stop: "72%" };
  }
  if (bg === "warn") {
    return {
      color: theme.warn,
      opacity: 0.4,
      anim: "gtWarnPulse 0.5s ease-in-out 2",
      stop: "72%",
    };
  }
  if (bg === "finish") {
    return { color: theme.finish, opacity: 0.9, anim: "none", stop: "120%" };
  }
  return { color: "transparent", opacity: 0, anim: "none", stop: "72%" };
}
