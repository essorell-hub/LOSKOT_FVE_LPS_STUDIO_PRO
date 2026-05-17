# v44 FVE Panel Editor Runtime Foundation

v44 přidává bezpečný runtime základ pro editor FVE panelů bez zásahu do Classic PRO vzhledu a bez změny preview HTML.

## Cíl v44

- výběr FVE panelů podle ID,
- hromadný výběr všech panelů,
- režimy výběru `replace`, `add`, `remove`, `toggle`,
- přesun vybraných nebo explicitně zadaných panelů přes `dx` / `dy`,
- příprava stringů jako datový model `fve.strings`,
- strukturované runtime výsledky ve formátu `ok`, `data`, `warnings`, `errors`,
- chyba editoru nebo modulu nesmí způsobit bílou obrazovku.

## Zásady

- Nemění se Classic PRO UI.
- Nemění se preview HTML.
- Nemění se `package.json` ani `package-lock.json`.
- Funkce běží přes runtime controller a sdílený projektový model.
- Příprava stringů není finální elektro návrh stringování; jde o bezpečný datový základ pro další verze.

## Přidané runtime API

Soubor:

`src/runtime/fvePanelEditor.js`

Exporty:

- `FVE_PANEL_EDITOR_VERSION`
- `createFvePanelEditor(options)`
- `safeFvePanelEditor(options)`

Hlavní akce editoru:

- `listPanels()`
- `selectPanels({ panelIds, mode })`
- `selectAllPanels()`
- `clearSelection()`
- `movePanels({ panelIds, dx, dy })`
- `moveSelection({ dx, dy })`
- `prepareStrings({ panelIds, stringPrefix, maxPanelsPerString })`
- `run(action, payload)`

## Ověření

Smoke test:

`tests/runtime/v44_fve_panel_editor_smoke_test.js`

Verify skript:

`scripts/verify/verify_v44_fve_panel_editor.sh`
