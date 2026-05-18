# V74 – FULL APP PREVIEW

## Účel

První FULL APP Preview: workflow obrazovky, runtime orchestrace a safe fallback UI.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/fullAppPreviewRuntime.js`
- `tests/runtime/v74_full_app_preview_smoke_test.js`
- `scripts/verify/verify_v74_full_app_preview.sh`
- `docs/runtime/v74/v74_FULL_APP_PREVIEW.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
