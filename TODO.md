# TODO

## Обновление зависимостей

🟡 **Линт-стек** (отдельным заходом — это замена конфигурации, не просто бамп):
- `eslint` 8 → 10, `@typescript-eslint/*` 5 → 8, `prettier` 2 → 3.
- Завязано на `eslint-config-airbnb-typescript-prettier` (не поддерживается, пинит
  eslint 8 / tseslint 5 / prettier 2). eslint 9+ требует flat-config — `.eslintrc.cjs`
  перестанет работать. Prettier 3 переформатирует файлы (изменились дефолты).

⚪ **Опционально:**
- `react` / `react-dom` 18 → 19 (+ `@types/react`, `@types/react-dom`).
- `typescript` 5.9 → 6.0 (вместе с typescript-eslint, после проверки совместимости).

## Иконки приложения

Разобраться с иконками — сейчас это дефолтные ассеты от Create React App:
- `public/favicon.ico`, `public/logo192.png`, `public/logo512.png` — заменить на
  настоящие иконки таймера (фавиконка + PWA + apple-touch-icon).
- `public/manifest.json` — цвета от старой светлой темы, привести к тёмной:
  `theme_color` `#000000` → `#0a0c0f`, `background_color` `#ffffff` → `#0a0c0f`.
  (В `index.html` `theme-color` уже `#0a0c0f` — синхронизировать.)
- Проверить размеры/назначение: maskable-иконка для Android, корректный
  `apple-touch-icon` (180×180).
