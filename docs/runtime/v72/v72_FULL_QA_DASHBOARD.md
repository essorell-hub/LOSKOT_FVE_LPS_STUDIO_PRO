# V72 – FULL QA DASHBOARD

## Účel

Sjednocený QA dashboard pro FVE, CAD, LPS, dokumenty, export a release readiness.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/fullQaDashboardRuntime.js`
- `tests/runtime/v72_full_qa_dashboard_smoke_test.js`
- `scripts/verify/verify_v72_full_qa_dashboard.sh`
- `docs/runtime/v72/v72_FULL_QA_DASHBOARD.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
