# V66 – REAL PROJECT SAVE LOAD

## Účel

Reálné save/load projektu nad jednotným projektovým modelem, JSON snapshoty a bezpečný restore.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/realProjectSaveLoad.js`
- `tests/runtime/v66_real_project_save_load_smoke_test.js`
- `scripts/verify/verify_v66_real_project_save_load.sh`
- `docs/runtime/v66/v66_REAL_PROJECT_SAVE_LOAD.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
