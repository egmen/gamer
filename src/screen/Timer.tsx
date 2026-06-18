import React from "react";
import { observer } from "mobx-react";

import timer from "../timer";
import settings from "../settings";
import { THEMES } from "../themes";
import { getOverlay } from "./view";
import DotRing from "./components/DotRing";
import SettingsSheet from "./components/SettingsSheet";

function Timer(): React.JSX.Element {
  const theme = THEMES[settings.theme];
  const overlay = getOverlay(timer.bg, theme);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={timer.restart}
      onKeyPress={timer.restart}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: theme.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono',ui-monospace,monospace",
        cursor: "pointer",
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Заливка-вспышка фона (старт / предупреждение / финиш). */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background: `radial-gradient(circle at 50% 42%, ${overlay.color} 0%, transparent ${overlay.stop})`,
          opacity: overlay.opacity,
          transition: "opacity .55s ease",
          animation: overlay.anim,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 22px",
          zIndex: 6,
        }}
      >
        <button
          type="button"
          onClick={timer.openSettings}
          style={{
            appearance: "none",
            border: "1px solid rgba(255,255,255,.16)",
            background: "rgba(255,255,255,.04)",
            color: "rgba(255,255,255,.6)",
            fontFamily: "inherit",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 2,
            padding: "7px 12px",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          МЕНЮ
        </button>
      </div>

      <DotRing />

      {timer.settingsOpen && <SettingsSheet />}
    </div>
  );
}

export default observer(Timer);
