import React from "react";
import { observer } from "mobx-react";

import timer from "../../timer";
import settings from "../../settings";
import { THEMES } from "../../themes";
import { buildDots, getHint } from "../view";

/** Кольцо точек с центральным счётчиком секунд и статусом. */
function DotRing(): React.JSX.Element {
  const theme = THEMES[settings.theme];
  const total = settings.moveTime;
  const elapsedSec = timer.phase === "finished" ? total : timer.elapsedSec;

  const dots = buildDots(theme, total, settings.warningTime, elapsedSec);
  const hint = getHint(
    timer.phase,
    timer.bg,
    timer.timeLeft,
    settings.warningTime,
    theme,
  );

  return (
    <div
      style={{
        position: "relative",
        width: 300,
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3,
      }}
    >
      {dots.map((dot) => (
        <div key={dot.key} style={dot.style} />
      ))}
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 200,
            letterSpacing: 1,
            color: theme.text,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {timer.timeLeft}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: hint.color,
            transition: "color .3s ease",
          }}
        >
          {hint.text}
        </div>
      </div>
    </div>
  );
}

export default observer(DotRing);
