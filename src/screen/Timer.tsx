import React from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import timer from "../timer";
import settings from "../settings";

function Timer(): JSX.Element {
  return (
    <div
      role="button"
      tabIndex={0}
      className={classNames({
        timer: true,
        start: timer.isStartTime,
        warning: timer.isWarningTime,
        finish: timer.isFinishTime,
      })}
      onClick={timer.handleClick}
      onKeyPress={timer.handleClick}
    >
      <h1>Время срабатывания таймера</h1>
      <p>
        Время хода:
        {settings.moveTime}
        <button type="button" onClick={timer.handleChangeMoveTime}>
          Изменить
        </button>
      </p>
      <p>
        Время предупреждения:
        {settings.warningTime}
        <button type="button" onClick={timer.handleChangeWarning}>
          Изменить
        </button>
      </p>
      <p>
        <button type="button" onClick={timer.handleClearSettings}>
          По-умолчанию
        </button>
      </p>
      <p>
        <button type="button" onClick={timer.handleToggleMuted}>
          {settings.isMuted ? "🔈" : "🔊"}
        </button>
      </p>
      <h1>
        {timer.currentTime}
        <br />
        {timer.className}
        <br />
      </h1>
      <h1>Осталось:</h1>
      <p className="left">{timer.timeLeft}</p>
    </div>
  );
}

export default observer(Timer);
