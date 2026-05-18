# V56 – LPS SPD DATA ENGINE

## Účel

LPS / DEHN / SPD datový engine, LPZ a datové výstupy pro dokumenty.

## Přidané soubory

- `src/runtime/lpsSpdDataEngine.js`
- `tests/runtime/v56_lps_spd_data_engine_smoke_test.js`
- `scripts/verify/verify_v56_lps_spd_data_engine.sh`
- `docs/runtime/v56/v56_LPS_SPD_DATA_ENGINE.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Vrací structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.

## Spuštění

Pouze přes SAFE RUN script a až po úspěšné předchozí verzi.
