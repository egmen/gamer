import _ from "lodash";
import {
  observable,
  action,
  autorun,
  toJS,
  set,
  makeAutoObservable,
} from "mobx";

export class SettingsStore {
  moveTime = 40;

  warningTime = 10;

  isMuted = false;

  private firstRun = true;

  constructor() {
    // Загрузка настроек из localStorage
    autorun(() => {
      if (this.firstRun) {
        const store = window.localStorage.getItem("settings") || "{}";
        try {
          const settings = JSON.parse(store);
          set(this, settings);
        } finally {
          this.firstRun = false;
        }
      }
      const cleanSettings = _.omit(toJS(this), ["firstRun"]);
      window.localStorage.setItem("settings", JSON.stringify(cleanSettings));
    });

    makeAutoObservable(this, {
      moveTime: observable,
      warningTime: observable,
      isMuted: observable,
      clear: action,
    });
  }

  public clear = (): void => {
    delete window.localStorage.settings;
    Object.assign(this, {});
    window.location.reload();
  };
}

export default new SettingsStore();
