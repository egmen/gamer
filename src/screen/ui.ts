import type { CSSProperties } from "react";

import type { Theme } from "../themes";

/** Круглая кнопка −/+ в шагах настроек. */
export function stepBtn(theme: Theme): CSSProperties {
  return {
    appearance: "none",
    border: "1px solid rgba(255,255,255,.16)",
    background: "rgba(255,255,255,.05)",
    color: theme.text,
    fontFamily: "inherit",
    fontSize: 22,
    fontWeight: 300,
    lineHeight: 1,
    width: 40,
    height: 40,
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

/** Кнопка сегментированного переключателя (темы / звук). */
export function selectBtn(theme: Theme, active: boolean): CSSProperties {
  return {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    border: `1px solid ${active ? theme.accent : "rgba(255,255,255,.16)"}`,
    background: active ? `${theme.accent}22` : "transparent",
    color: active ? theme.text : "rgba(255,255,255,.5)",
    fontFamily: "inherit",
    fontSize: 12,
    letterSpacing: ".3px",
    fontWeight: active ? 500 : 400,
    padding: "11px 6px",
    borderRadius: 12,
    cursor: "pointer",
  };
}
