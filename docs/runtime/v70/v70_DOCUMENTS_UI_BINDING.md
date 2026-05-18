# V70 – DOCUMENTS UI BINDING

## Účel

Napojení dokumentů/reportů/export QA do UI a projektového workflow.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/documentsUiBinding.js`
- `tests/runtime/v70_documents_ui_binding_smoke_test.js`
- `scripts/verify/verify_v70_documents_ui_binding.sh`
- `docs/runtime/v70/v70_DOCUMENTS_UI_BINDING.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
