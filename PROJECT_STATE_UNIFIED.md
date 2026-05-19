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
