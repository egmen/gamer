import { notify } from "./store";

import type { ThemeKey } from "./themes";
import type { SoundSet } from "./sound/playAudio";

export interface Settings {
  moveTime: number;
  warningTime: number;
  theme: ThemeKey;
  soundSet: SoundSet;
}

const DEFAULTS: Settings = {
  moveTime: 60,
  warningTime: 10,
  theme: "midnight",
  soundSet: "chgk",
};

/** Читает настройки из localStorage, дополняя значениями по умолчанию. */
function load(): Settings {
  const result: Settings = { ...DEFAULTS };
  try {
    const stored = JSON.parse(window.localStorage.getItem("settings") || "{}");
    if (stored && typeof stored === "object") {
      // Миграция со старого булева isMuted на набор звуков.
      if (stored.soundSet === undefined && stored.isMuted) {
        stored.soundSet = "off";
      }
      delete stored.isMuted;
      Object.assign(result, stored);
    }
  } catch {
    // повреждённый JSON — остаёмся на значениях по умолчанию
  }
  return result;
}

function persist(s: Settings): void {
  window.localStorage.setItem(
    "settings",
    JSON.stringify({
      moveTime: s.moveTime,
      warningTime: s.warningTime,
      theme: s.theme,
      soundSet: s.soundSet,
    }),
  );
}

const state = load();
persist(state);

// Прокси заменяет mobx observable + autorun: любое присваивание поля
// сохраняет настройки в localStorage и уведомляет UI о перерисовке.
const settings = new Proxy(state, {
  set(target, key, value) {
    Reflect.set(target, key, value);
    persist(target);
    notify();
    return true;
  },
});

export default settings;
