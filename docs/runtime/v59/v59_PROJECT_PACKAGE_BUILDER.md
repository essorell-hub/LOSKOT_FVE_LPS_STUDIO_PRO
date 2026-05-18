# V59 – PROJECT PACKAGE BUILDER

## Účel

Exportní manifest, export plan a handoff checklist projektového balíku.

## Přidané soubory

- `src/runtime/projectPackageBuilder.js`
- `tests/runtime/v59_project_package_builder_smoke_test.js`
- `scripts/verify/verify_v59_project_package_builder.sh`
- `docs/runtime/v59/v59_PROJECT_PACKAGE_BUILDER.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Vrací structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.

## Spuštění

Pouze přes SAFE RUN script a až po úspěšné předchozí verzi.
