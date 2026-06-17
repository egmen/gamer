import React from "react";

import type { Theme } from "../../themes";
import { stepBtn } from "../ui";

interface StepperProps {
  theme: Theme;
  label: string;
  hint: string;
  /** Уже отформатированное значение, например «60с». */
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  /** Нижняя разделительная линия. */
  divider: boolean;
}

/** Строка настройки с шагом −/значение/+ (время хода, предупреждение). */
function Stepper({
  theme,
  label,
  hint,
  value,
  onDecrement,
  onIncrement,
  divider,
}: StepperProps): JSX.Element {
  const btn = stepBtn(theme);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: divider ? "1px solid rgba(255,255,255,.06)" : undefined,
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, opacity: 0.4, marginTop: 3 }}>{hint}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDecrement();
          }}
          style={btn}
        >
          −
        </button>
        <div
          style={{
            fontFamily: "inherit",
            fontSize: 22,
            fontWeight: 300,
            minWidth: 64,
            textAlign: "center",
          }}
        >
          {value}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIncrement();
          }}
          style={btn}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Stepper;
