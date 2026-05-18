# V71 – EXPORT PACKAGE UI BINDING

## Účel

Napojení project package builderu do UI, manifestu a handoff checklistu.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/exportPackageUiBinding.js`
- `tests/runtime/v71_export_package_ui_binding_smoke_test.js`
- `scripts/verify/verify_v71_export_package_ui_binding.sh`
- `docs/runtime/v71/v71_EXPORT_PACKAGE_UI_BINDING.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
