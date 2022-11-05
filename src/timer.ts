/* eslint-disable class-methods-use-this */
import _ from "lodash";
import {
  observable,
  action,
  computed,
  autorun,
  makeAutoObservable,
} from "mobx";

import { play, PlayType } from "./sound/playAudio";
import settings from "./settings";

function playMuted(type: PlayType, isMuted: boolean): void {
  if (isMuted) {
    return;
  }
  play(type);
}

type ButtonClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

class Timer {
  isActive = false;

  currentTime = 0;

  timerId = 0;

  constructor() {
    autorun(() => {
      if (this.currentTime >= settings.moveTime) {
        this.isActive = false;
      }
      if (this.isFinishTime) {
        playMuted(PlayType.FINISH, settings.isMuted);
      }
      if (this.isWarningTime) {
        playMuted(PlayType.WARNING, settings.isMuted);
      }
      if (!this.isActive && this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = 0;
      }
    });

    makeAutoObservable(this, {
      isActive: observable,
      currentTime: observable,
      timerId: observable,
      isStartTime: computed,
      isWarningTime: computed,
      isFinishTime: computed,
      handleClick: action,
      className: computed,
      timeLeft: computed,
      handleChangeWarning: action,
      handleChangeMoveTime: action,
      handleToggleMuted: action,
    });
  }

  get isStartTime(): boolean {
    return this.isActive && this.currentTime === 0;
  }

  get isWarningTime(): boolean {
    const { currentTime } = this;
    return settings.moveTime - currentTime === settings.warningTime;
  }

  get isFinishTime(): boolean {
    const { currentTime } = this;
    return settings.moveTime === currentTime;
  }

  handleClick = (): void => {
    clearTimeout(this.timerId);
    this.timerId = +setInterval(() => {
      this.currentTime += 1;
    }, 1000);
    this.isActive = true;
    this.currentTime = 0;
    playMuted(PlayType.START, settings.isMuted);
  };

  get className(): string {
    return this.isActive ? "active" : "paused";
  }

  get timeLeft(): number {
    return settings.moveTime - this.currentTime;
  }

  handleChangeMoveTime = (event: ButtonClickEvent): void => {
    event.stopPropagation();
    const moveTime = Number(
      window.prompt("Введите новое значение", String(settings.moveTime))
    );
    if (moveTime && _.isNumber(moveTime)) {
      settings.moveTime = moveTime;
    }
  };

  handleChangeWarning = (event: ButtonClickEvent): void => {
    event.stopPropagation();
    const warningTime = Number(
      window.prompt("Введите новое значение", String(settings.warningTime))
    );
    if (warningTime && _.isNumber(warningTime)) {
      settings.warningTime = warningTime;
    }
  };

  handleClearSettings(event: ButtonClickEvent): void {
    event.stopPropagation();
    settings.clear();
    Object.assign(this, {});
    window.location.reload();
  }

  handleToggleMuted = (event: ButtonClickEvent): void => {
    event.stopPropagation();
    settings.isMuted = !settings.isMuted;
  };
}

export default new Timer();
