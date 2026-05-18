# V69 – LPS SPD UI BINDING

## Účel

Napojení LPS/SPD/LPZ dat do UI, inspectoru, QA a dokumentů.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/lpsSpdUiBinding.js`
- `tests/runtime/v69_lps_spd_ui_binding_smoke_test.js`
- `scripts/verify/verify_v69_lps_spd_ui_binding.sh`
- `docs/runtime/v69/v69_LPS_SPD_UI_BINDING.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
