# PROJECT_STATE_UNIFIED

## Projekt

LOSKOT FVE & LPS STUDIO PRO

## Aktuální verze

v21 SHARED PROJECT MODEL

## Stav

Repozitář pokračuje ze základny `v20 UNIFIED APP FOUNDATION`. Verze v21 zachovává Classic PRO tmavý vzhled, levé modulové menu, dashboard, Project Inspector, CAD/mapa preview, JSON export a ochranu proti bílé obrazovce. Hlavní změna v21 je společný datový model projektu pro FVE + LPS, aby program nepůsobil jako samostatný hromosvodářský nástroj.

## Hlavní cíl

Jeden společný program pro FVE, LPS/DEHN, SPD/LPZ, CAD/mapu, dokumenty, databáze zařízení, exporty a pozdější Windows aplikaci přes React/Tauri/SQLite.

## Zdrojové větve

### FVE část

LOSKOT FVE Studio PRO slouží jako zdroj pro:

- datový model zakázky,
- Project Inspector,
- FVE panely,
- stringy,
- DC trasy,
- měniče,
- dokumenty,
- databáze zařízení,
- exportní balíčky,
- budoucí FVE výpočty.

### LPS / DEHN část

LOSKOT DEHN Risk Tool Pro / LPS Studio slouží jako zdroj pro:

- Classic PRO vzhled,
- CAD náhled,
- LPS logiku,
- DEHN / risk modul,
- jímací soustavu,
- HVI,
- svody,
- zemnění,
- SPD,
- LPZ,
- mapu a technický náhled.

## Nezrušit / nepoškodit

- Classic PRO tmavý vzhled.
- Levé menu.
- Dashboard.
- Funkční přepínání obrazovek.
- Project Inspector.
- CAD preview.
- Mapa nebo její technický placeholder.
- Automatické náhledy.
- JSON export.
- JSON import jako základ budoucí databáze.
- Ochrana proti bílé obrazovce.

## Cílové moduly

- Dashboard
- Sdílený projektový model
- Project Inspector
- FVE
- LPS / DEHN
- SPD / LPZ
- CAD / Mapa
- Dokumenty
- Databáze
- Exporty
- Nastavení

## Sdílený datový model v21

Model je rozdělen na samostatné sekce:

- `zakazka`
- `objekt`
- `strecha`
- `fve`
- `lps`
- `spd`
- `lpz`
- `cad`
- `dokumenty`
- `databaze`
- `exporty`
- `qa`

Ukázkový JSON projekt je uložen zde:

`database/sample-projects/LOSKOT_FVE_LPS_STUDIO_PRO_v21_sample_project.json`

## Příprava na React/Tauri/SQLite

v21 je pořád kontrolovatelný HTML preview soubor na dvojklik, ale datový model je připravený pro pozdější rozdělení do těchto vrstev:

```text
src/
  app/
  components/
  modules/
    dashboard/
    project-model/
    fve/
    lps/
    spd-lpz/
    cad-map/
    documents/
    database/
    exports/
  engines/
  database/
  export/
src-tauri/
database/
  sample-projects/
```

Navržené SQLite tabulky:

- `projects`
- `objects`
- `roofs`
- `pv_arrays`
- `pv_strings`
- `inverters`
- `lps_components`
- `spd_devices`
- `lpz_zones`
- `cad_objects`
- `documents`
- `exports`

## Stav v21

Hotovo:

- nový HTML preview soubor do `/preview`,
- zachování Classic PRO shellu z v20,
- zachování funkčního přepínání modulů,
- výraznější prezentace jako společný FVE + LPS program,
- samostatná obrazovka Sdílený model,
- oddělení dat zakázka / objekt / střecha / FVE / LPS / SPD / LPZ / CAD / dokumenty / databáze / exporty,
- ukázková data projektu,
- JSON export,
- JSON import s kontrolou povinných sekcí,
- Project Inspector napojený na sdílený model,
- QA semafor v21,
- CAD preview se společnými FVE + LPS vrstvami,
- ochrana proti bílé obrazovce přes bezpečné vykreslování modulu a globální zachytávání chyb.

Není hotovo:

- skutečný import starých HTML zdrojů,
- plné normové výpočty,
- fyzická SQLite databáze,
- React/Tauri build,
- práce s reálnými mapovými podklady,
- dokumentové šablony DOCX/PDF.

## Další verze

v22 REACT TAURI SCAFFOLD

Doporučený cíl:

- převést současný HTML preview do čisté React struktury,
- oddělit datový model do samostatného souboru,
- oddělit FVE/LPS/SPD/LPZ/CAD moduly,
- zachovat Classic PRO vzhled,
- vytvořit první Tauri-ready strukturu,
- připravit SQLite adapter bez ostrého zápisu do databáze.


## V151_UI_FOUNDATION_REGISTRY_READY

- UI foundation baseline is represented in runtime code as a registry, not as a replacement of the approved visual style.
- Approved baseline: APPROVED_UI_STYLE_BASELINE_01.
- Approved main-screen package is ready for next app-shell implementation step.
- This state does not unlock or change any approved screen; it only formalizes approved identifiers for implementation and QA.


## V152_UI_APP_SHELL_BINDING_READY

- V151 approved UI registry is now consumable by a runtime app-shell binding layer.
- Binding produces navigation modules, active screen state, workflow sequence, and QA panel contract.
- This does not alter approved screen graphics, CSS, layout, or visual style.
- This prepares the next safe step: real shell integration into the existing app runtime.


## V153_UI_BOOTSTRAP_BINDING_READY

- V152 app-shell binding is now bridged to the existing runtime bootstrap module through an additive adapter.
- The adapter exposes bootstrap metadata, app-shell binding state, active route, visual-lock state, and QA/bootstrap readiness.
- This does not modify approved screen graphics, CSS, layout, image assets, React/JSX components, or the locked Classic PRO visual baseline.
- This prepares the next safe step: controlled runtime integration without visual redesign.


## V154_UI_UNIFIED_INTEGRATION_READY

- V153 UI bootstrap binding is now bridged to the existing unified app integration module through an additive runtime adapter.
- The adapter exposes unified-app metadata, active UI route, app-shell/bootstrap readiness, visual-lock state, and integration QA status.
- This does not modify approved screen graphics, CSS, HTML, image assets, JSX/TSX UI components, or the locked Classic PRO visual baseline.
- This prepares the next safe step: controlled UI runtime composition into the application shell without redesign.


## V155_FAST_APP_RUNTIME_SHELL_READY

- V154 unified integration binding is now exposed as a first app runtime shell view-model.
- The runtime shell exposes active route, screen metadata, navigation, QA panel, startup plan, and runtime composition state.
- This remains additive and does not modify approved screen graphics, CSS, HTML, images, JSX/TSX components, or the locked Classic PRO UI baseline.
- This prepares later controlled attachment to the visible application shell.


## V156_FAST_APP_STATE_SHELL_CONNECTOR_READY

- V155 app runtime shell is now connected to application state/controller metadata through an additive runtime connector.
- The connector exposes active route, shell summary, runtime state snapshot, controller/module inspection, action contract and QA status.
- This remains additive and does not modify approved screen graphics, CSS, HTML, images, JSX/TSX components, or the locked Classic PRO UI baseline.
- This prepares later controlled runtime action handling and visible shell attachment.


## V157_V159_FAST_RUNTIME_MINIPACK_READY

- V157 runtime action dispatcher, V158 project context bridge, and V159 QA panel runtime feed are added as one controlled FAST minipack.
- The minipack extends the state-driven app runtime shell without modifying approved graphics, CSS, HTML, image assets, JSX/TSX components, or the locked Classic PRO UI baseline.
- This prepares controlled runtime navigation actions, project context propagation, and QA panel feed composition.
