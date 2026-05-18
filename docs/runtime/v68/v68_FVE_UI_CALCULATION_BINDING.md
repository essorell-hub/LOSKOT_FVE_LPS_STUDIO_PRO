# V68 – FVE UI CALCULATION BINDING

## Účel

Napojení FVE výpočtového enginu do UI workflow, inspectoru a QA.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/fveUiCalculationBinding.js`
- `tests/runtime/v68_fve_ui_calculation_binding_smoke_test.js`
- `scripts/verify/verify_v68_fve_ui_calculation_binding.sh`
- `docs/runtime/v68/v68_FVE_UI_CALCULATION_BINDING.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
