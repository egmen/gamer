import { useSyncExternalStore } from "react";

// Минимальная реактивность вместо mobx: глобальный счётчик версий и набор
// подписчиков. Любая мутация сторов вызывает notify(), что перерисовывает
// все компоненты, подписанные через useStore(). Для приложения такого размера
// (один экран, два синглтон-стора) точечная подписка по полям не нужна.

let version = 0;
const listeners = new Set<() => void>();

/** Уведомить UI об изменении любого стора. */
export function notify(): void {
  version += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Хук перерисовки при изменении сторов — замена mobx `observer`.
 * Вызовите в начале компонента, который читает `timer`/`settings`.
 */
export function useStore(): void {
  useSyncExternalStore(subscribe, () => version);
}
