import React from "react";

import type { Theme } from "../../themes";
import { selectBtn } from "../ui";

export interface SegmentOption<T extends string> {
  key: T;
  name: string;
  /** Цвет кружка-индикатора слева (используется для тем). */
  dotColor?: string;
}

interface SegmentedControlProps<T extends string> {
  theme: Theme;
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onPick: (key: T) => void;
  /** Нижняя разделительная линия. */
  divider: boolean;
}

/** Строка настройки с рядом кнопок-переключателей (оформление, звук). */
function SegmentedControl<T extends string>({
  theme,
  label,
  options,
  value,
  onPick,
  divider,
}: SegmentedControlProps<T>): JSX.Element {
  return (
    <div
      style={{
        padding: "16px 0",
        borderBottom: divider ? "1px solid rgba(255,255,255,.06)" : undefined,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPick(option.key);
            }}
            style={selectBtn(theme, value === option.key)}
          >
            {option.dotColor && (
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: option.dotColor,
                  display: "inline-block",
                }}
              />
            )}
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SegmentedControl;
