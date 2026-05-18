# V55 – FVE CALCULATION ENGINE

## Účel

FVE výpočty kWp, stringů, střídačů, MPPT a QA.

## Přidané soubory

- `src/runtime/fveCalculationEngine.js`
- `tests/runtime/v55_fve_calculation_engine_smoke_test.js`
- `scripts/verify/verify_v55_fve_calculation_engine.sh`
- `docs/runtime/v55/v55_FVE_CALCULATION_ENGINE.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Všechny chyby vrací jako structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.

## Další krok

Pokračovat až po úspěšném výsledku tohoto balíku a po kontrole `===== LOSKOT RESULT =====`.
