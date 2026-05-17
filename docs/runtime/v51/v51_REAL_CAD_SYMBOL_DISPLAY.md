# V51 – REAL CAD SYMBOL DISPLAY

## Účel

Napojení reálných CAD symbolů do bezpečného symbol display packetu po V50.

## Přidané soubory

- `src/runtime/realCadSymbolDisplay.js`
- `tests/runtime/v51_real_cad_symbol_display_smoke_test.js`
- `scripts/verify/verify_v51_real_cad_symbol_display.sh`
- `docs/runtime/v51/v51_REAL_CAD_SYMBOL_DISPLAY.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Všechny chyby vrací jako structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.

## Další krok

Pokračovat až po úspěšném výsledku tohoto balíku a po kontrole `===== LOSKOT RESULT =====`.
