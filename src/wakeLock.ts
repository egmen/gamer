// Удержание экрана от засыпания (Screen Wake Lock API).
//
// Блокировка автоматически снимается, когда вкладка/приложение уходит в фон,
// и сама не восстанавливается. Поэтому храним sentinel и переполучаем
// блокировку при возврате видимости (а также по запросу — на тапе-рестарте,
// что является пользовательским жестом).

let sentinel: WakeLockSentinel | null = null;
let listening = false;

async function acquire(): Promise<void> {
  if (!("wakeLock" in navigator)) {
    return;
  }
  if (sentinel && !sentinel.released) {
    return;
  }
  try {
    sentinel = await navigator.wakeLock.request("screen");
    sentinel.addEventListener("release", () => {
      sentinel = null;
    });
  } catch {
    // NotAllowedError: фон, низкий заряд, небезопасный контекст и т.п.
    sentinel = null;
  }
}

/** Включает удержание экрана и (однократно) подписку на возврат видимости. */
export default function enableWakeLock(): void {
  acquire();
  if (!listening) {
    listening = true;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        acquire();
      }
    });
  }
}
