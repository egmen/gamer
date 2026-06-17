export type ThemeKey = "midnight" | "coal" | "indigo";

export interface Theme {
  /** Человекочитаемое название для меню. */
  name: string;
  /** Цвет фона экрана. */
  bg: string;
  /** Основной акцент (прошедшие точки, активные элементы). */
  accent: string;
  /** Цвет зоны предупреждения. */
  warn: string;
  /** Цвет финиша (заливка фона по окончании). */
  finish: string;
  /** Цвет «погашенных» точек. */
  dotBase: string;
  /** Цвет текста. */
  text: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  midnight: {
    name: "Полночь",
    bg: "#0a0c0f",
    accent: "#43d6a0",
    warn: "#ffb24a",
    finish: "#ff4d4d",
    dotBase: "#23282f",
    text: "#eef2f5",
  },
  coal: {
    name: "Уголь",
    bg: "#110d0b",
    accent: "#e0a86a",
    warn: "#ff8a5c",
    finish: "#e23d3d",
    dotBase: "#2a2420",
    text: "#f3ece4",
  },
  indigo: {
    name: "Индиго",
    bg: "#0b0d1a",
    accent: "#5b8cff",
    warn: "#b06bff",
    finish: "#ff4d8d",
    dotBase: "#20243a",
    text: "#e9ecff",
  },
};

/** Порядок тем в переключателе меню. */
export const THEME_LIST: ThemeKey[] = ["midnight", "coal", "indigo"];
