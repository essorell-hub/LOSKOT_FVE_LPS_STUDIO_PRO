# V52 – PROJECT INSPECTOR LAYERS

## Účel

Vrstvy, viditelnost a Project Inspector model bez zásahu do UI.

## Přidané soubory

- `src/runtime/projectInspectorLayers.js`
- `tests/runtime/v52_project_inspector_layers_smoke_test.js`
- `scripts/verify/verify_v52_project_inspector_layers.sh`
- `docs/runtime/v52/v52_PROJECT_INSPECTOR_LAYERS.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Všechny chyby vrací jako structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.

## Další krok

Pokračovat až po úspěšném výsledku tohoto balíku a po kontrole `===== LOSKOT RESULT =====`.
