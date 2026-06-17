import {
  observable,
  action,
  autorun,
  toJS,
  set,
  makeAutoObservable,
} from "mobx";

import type { ThemeKey } from "./themes";
import type { SoundSet } from "./sound/playAudio";

export class SettingsStore {
  moveTime = 60;

  warningTime = 10;

  theme: ThemeKey = "midnight";

  soundSet: SoundSet = "chgk";

  private firstRun = true;

  constructor() {
    makeAutoObservable(this, {
      moveTime: observable,
      warningTime: observable,
      theme: observable,
      soundSet: observable,
      clear: action,
    });

    // Загрузка настроек из localStorage
    autorun(() => {
      if (this.firstRun) {
        const store = window.localStorage.getItem("settings") || "{}";
        try {
          const settings = JSON.parse(store);
          // Миграция со старого булева isMuted на набор звуков.
          if (settings && settings.soundSet === undefined && settings.isMuted) {
            settings.soundSet = "off";
          }
          delete settings.isMuted;
          set(this, settings);
        } finally {
          this.firstRun = false;
        }
      }
      const cleanSettings = toJS({
        moveTime: this.moveTime,
        warningTime: this.warningTime,
        theme: this.theme,
        soundSet: this.soundSet,
      });
      window.localStorage.setItem("settings", JSON.stringify(cleanSettings));
    });
  }

  public clear = (): void => {
    delete window.localStorage.settings;
    Object.assign(this, {});
    window.location.reload();
  };
}

export default new SettingsStore();
