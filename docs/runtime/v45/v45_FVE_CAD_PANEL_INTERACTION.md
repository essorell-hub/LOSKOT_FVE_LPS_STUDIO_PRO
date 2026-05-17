# v45 FVE CAD Panel Interaction Bridge

v45 přidává bezpečnou runtime mezivrstvu mezi FVE panelem editoru z v44 a budoucím CAD/UI zobrazením. Cílem je připravit skutečnou interakci v CAD náhledu bez zásahu do schváleného Classic PRO vzhledu.

## Cíl v45

- převod `project.fve.panels` na CAD view-model vhodný pro vykreslení,
- bezpečný panelový hit-test podle CAD souřadnic,
- výběr panelu kliknutím na bod,
- hromadný výběr panelů obdélníkem,
- posun vybraných panelů přes nudge příkaz,
- začátek / průběh / konec drag operace,
- příprava stringů z CAD výběru,
- UI binding summary pro pozdější napojení na Classic PRO panel,
- žádná chyba v této vrstvě nesmí způsobit bílou obrazovku.

## Zásady

- Nemění se Classic PRO UI.
- Nemění se preview HTML.
- Nemění se `package.json` ani `package-lock.json`.
- Není zde přímé kreslení do DOM/CSS; jde o bezpečný runtime CAD model a příkazový bridge.
- Veškeré změny panelů jdou přes v44 FVE panel editor a sdílený runtime controller.

## Přidané runtime API

Soubor:

`src/runtime/fveCadPanelInteraction.js`

Exporty:

- `FVE_CAD_PANEL_INTERACTION_VERSION`
- `createFveCadPanelInteractionBridge(options)`
- `safeFveCadPanelInteractionBridge(options)`

Hlavní akce bridge:

- `getCadViewModel(payload)`
- `hitTestPanel(payload)`
- `selectAtPoint(payload)`
- `selectByRectangle(payload)`
- `nudgeSelection(payload)`
- `startDrag(payload)`
- `dragBy(payload)`
- `endDrag(payload)`
- `prepareStringsFromSelection(payload)`
- `getUiSummary()`
- `runCommand(command, payload)`

## View-model

`getCadViewModel()` vrací zejména:

- `layerModel.layers` pro FVE panely a stringy,
- `viewBox` pro bezpečné vykreslení,
- `panels` jako normalizované CAD objekty,
- `strings` jako datovou vrstvu,
- `selection.selectedPanelIds`,
- `counts.panels`, `counts.selectedPanels`, `counts.strings`,
- `uiBindings.fvePanelCount`, `uiBindings.fveSelectionCount`, `uiBindings.fveStringCount`, `uiBindings.fveCadStatusText`,
- `classicProUnchanged: true`.

## Ověření

Smoke test:

`tests/runtime/v45_fve_cad_panel_interaction_smoke_test.js`

Verify skript:

`scripts/verify/verify_v45_fve_cad_panel_interaction.sh`

Verify navazuje na v44 a následně kontroluje v45 soubory, testy, package guard, strict grep a `git diff --check`.
