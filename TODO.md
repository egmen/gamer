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
