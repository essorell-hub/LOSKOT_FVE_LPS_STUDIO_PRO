# V65 – UNIFIED APP INTEGRATION FOUNDATION

## Účel

Sjednocení runtime modulů V49–V64 do jednoho aplikačního orchestrace layeru.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/unifiedAppIntegration.js`
- `tests/runtime/v65_unified_app_integration_foundation_smoke_test.js`
- `scripts/verify/verify_v65_unified_app_integration_foundation.sh`
- `docs/runtime/v65/v65_UNIFIED_APP_INTEGRATION_FOUNDATION.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
