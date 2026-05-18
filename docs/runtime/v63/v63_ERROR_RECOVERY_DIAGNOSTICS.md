# V63 – ERROR RECOVERY DIAGNOSTICS

## Účel

Diagnostika chyb, scan logů, white-screen guard status a recovery plán.

## Přidané soubory

- `src/runtime/errorRecoveryDiagnostics.js`
- `tests/runtime/v63_error_recovery_diagnostics_smoke_test.js`
- `scripts/verify/verify_v63_error_recovery_diagnostics.sh`
- `docs/runtime/v63/v63_ERROR_RECOVERY_DIAGNOSTICS.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Vrací structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.
