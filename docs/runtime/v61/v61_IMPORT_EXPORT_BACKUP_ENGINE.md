# V61 – IMPORT EXPORT BACKUP ENGINE

## Účel

Import/export/backup engine pro projektový JSON, snapshoty a restore plán.

## Přidané soubory

- `src/runtime/importExportBackupEngine.js`
- `tests/runtime/v61_import_export_backup_engine_smoke_test.js`
- `scripts/verify/verify_v61_import_export_backup_engine.sh`
- `docs/runtime/v61/v61_IMPORT_EXPORT_BACKUP_ENGINE.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Vrací structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.
