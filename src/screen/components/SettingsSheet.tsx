import React from "react";
import { observer } from "mobx-react";

import timer from "../../timer";
import settings from "../../settings";
import { THEMES, THEME_LIST, ThemeKey } from "../../themes";
import { SOUND_SETS, SoundSet } from "../../sound/playAudio";
import Stepper from "./Stepper";
import SegmentedControl, { SegmentOption } from "./SegmentedControl";

/** Выезжающая снизу панель настроек. */
function SettingsSheet(): React.JSX.Element {
  const theme = THEMES[settings.theme];

  const themeOptions: SegmentOption<ThemeKey>[] = THEME_LIST.map((key) => ({
    key,
    name: THEMES[key].name,
    dotColor: THEMES[key].accent,
  }));

  const soundOptions: SegmentOption<SoundSet>[] = SOUND_SETS.map((s) => ({
    key: s.key,
    name: s.name,
  }));

  return (
    <div
      onClick={timer.closeSettings}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        backdropFilter: "blur(3px)",
        zIndex: 30,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={timer.stopEvent}
        style={{
          width: "100%",
          background: "#15181d",
          borderTop: "1px solid rgba(255,255,255,.08)",
          borderRadius: "22px 22px 0 0",
          padding: "24px 24px calc(24px + env(safe-area-inset-bottom))",
          boxShadow: "0 -20px 60px rgba(0,0,0,.5)",
          color: "#eef2f5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.5,
            }}
          >
            Настройки
          </div>
          <button
            type="button"
            onClick={timer.closeSettings}
            style={{
              appearance: "none",
              border: "none",
              background: "none",
              color: "#eef2f5",
              fontFamily: "inherit",
              fontSize: 12,
              letterSpacing: 2,
              cursor: "pointer",
              opacity: 0.7,
            }}
          >
            ГОТОВО
          </button>
        </div>

        <Stepper
          theme={theme}
          label="Время хода"
          hint={`${settings.moveTime} сек`}
          value={`${settings.moveTime}с`}
          onDecrement={() => timer.stepMove(-5)}
          onIncrement={() => timer.stepMove(5)}
          divider
        />

        <Stepper
          theme={theme}
          label="Предупреждение"
          hint={`за ${settings.warningTime} сек до конца`}
          value={`${settings.warningTime}с`}
          onDecrement={() => timer.stepWarn(-1)}
          onIncrement={() => timer.stepWarn(1)}
          divider
        />

        <SegmentedControl
          theme={theme}
          label="Оформление"
          options={themeOptions}
          value={settings.theme}
          onPick={(key) => timer.pickTheme(key)}
          divider
        />

        <SegmentedControl
          theme={theme}
          label="Звук"
          options={soundOptions}
          value={settings.soundSet}
          onPick={(key) => timer.pickSoundSet(key)}
          divider={false}
        />

        <button
          type="button"
          onClick={timer.resetDefaults}
          style={{
            width: "100%",
            marginTop: 14,
            appearance: "none",
            border: "1px solid rgba(255,255,255,.12)",
            background: "none",
            color: "rgba(255,255,255,.55)",
            fontFamily: "inherit",
            fontSize: 12,
            letterSpacing: 2,
            padding: 13,
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          СБРОСИТЬ ПО УМОЛЧАНИЮ
        </button>
      </div>
    </div>
  );
}

export default observer(SettingsSheet);
