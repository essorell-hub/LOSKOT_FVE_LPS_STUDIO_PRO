# V73 – FULL INTEGRATION SMOKE TEST

## Účel

Velký integrační smoke test přes hlavní moduly a ochranu proti bílé obrazovce.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/fullIntegrationSmokeTestRuntime.js`
- `tests/runtime/v73_full_integration_smoke_test_smoke_test.js`
- `scripts/verify/verify_v73_full_integration_smoke_test.sh`
- `docs/runtime/v73/v73_FULL_INTEGRATION_SMOKE_TEST.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
