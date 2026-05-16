# FULL SYSTEM INTEGRATION PLAN (v31)

## Projekt: LOSKOT FVE & LPS STUDIO PRO

## Verze: v31 - Integrace databáze a pokročilých modulů

## Datum: 2026-05-16

## Cíl plánu

Tento dokument nastiňuje plán pro kompletní integraci všech klíčových modulů projektu LOSKOT FVE & LPS STUDIO PRO do jednotného systému. Plán se zaměřuje na verzi v31, která klade důraz na základy databázové integrace a pokročilé moduly (FVE, LPS, CAD).

## Milníky a závislosti

Integrace systému probíhá iterativně s jasně definovanými milníky a závislostmi mezi moduly.

### Fáze 1: Základy a Datová vrstva (dokončeno v předchozích verzích / v této verzi)

*   **[v20] Unified App Foundation**: Vytvoření základní struktury aplikace, UI shellu, levého menu, Dashboardu, Project Inspectoru.
*   **[v31] Database Integration Foundation**:
    *   Definice datového modelu (tabulky: `projects`, `objects`, `roofs`, `pv_arrays`, `inverters`, `lps_components`, `spd_devices`, `lpz_zones`, `cad_objects`, `documents`, `exports`, `qa`).
    *   Návrh přístupu k datům (Repository Pattern).
    *   Příprava na asynchronní operace.
    *   *Závislost*: Všechny navazující moduly.

### Fáze 2: Pokročilé moduly a jejich integrace (práce probíhá v této verzi)

*   **[v31] FVE Modul**:
    *   `v31_FVE_PANEL_EDITOR_NOTES.md`: Poznámky k editoru panelů.
    *   Integrace editoru panelů s projektovým modelem.
    *   Základní validace FVE dat.
    *   *Závislost*: Datová vrstva, Projektový model.
*   **[v31] LPS Modul**:
    *   `v31_LPS_OBJECTS_NOTES.md`: Poznámky k LPS objektům.
    *   Definice základních LPS objektů a jejich vlastností.
    *   Integrace LPS objektů s projektovým modelem.
    *   *Závislost*: Datová vrstva, Projektový model.
*   **[v31] CAD Modul**:
    *   `v31_CAD_LAYER_OBJECT_NOTES.md`: Poznámky k vrstvám a objektům.
    *   Definice CAD vrstev a objektů.
    *   Integrace CAD objektů s projektovým modelem a přiřazení k LPS/FVE komponentám.
    *   *Závislost*: Datová vrstva, Projektový model, FVE modul, LPS modul.
*   **[v31] Document Module Foundation**:
    *   `v31_DOCUMENT_MODULE_FOUNDATION.md`: Základní dokumentace modulu.
    *   Definice datového modelu pro dokumenty.
    *   Základní funkce pro správu metadat dokumentů.
    *   *Závislost*: Datová vrstva.

### Fáze 3: Dokončení a optimalizace (plánováno pro budoucí verze)

*   **Implementace databázového adaptéru**: Propojení s konkrétní databází (např. SQLite).
*   **Plné FVE výpočty**: Integrace komplexních výpočtů pro stringy, měniče, ztráty.
*   **Plné LPS výpočty**: Implementace normových výpočtů (rizikové analýzy, návrh svodů, uzemnění).
*   **CAD vizualizace a interakce**: Plně funkční vykreslování, editace a interakce v CAD modulu.
*   **Správa dokumentů**: Plná funkčnost pro nahrávání, správu a propojování dokumentů.
*   **Exporty**: Implementace všech definovaných exportních funkcí.
*   **QA a validace**: Dokončení a integrace QA semaforu a validačních nástrojů.
*   **Optimalizace výkonu**: Zajištění plynulého běhu aplikace i při velkém množství dat.
*   **React/Tauri příprava**: Dokončení přípravy pro budoucí přechod na React/Tauri.

## Rizika systémové integrace

*   **Nekonzistentní datové modely**: Rozdíly v datových modelech napříč moduly mohou zkomplikovat integraci.
*   **Chybějící API rozhraní**: Nedostatečně definovaná nebo implementovaná API mezi moduly.
*   **Závislosti na externích knihovnách**: Potenciální problémy s kompatibilitou nebo licencováním.
*   **Testování**: Nedostatečné automatizované testování může vést k přehlédnutí chyb při integraci.

## Další kroky

1.  Implementovat databázový adaptér (např. pro SQLite).
2.  Dokončit propojení FVE a LPS modulů s projektovým modelem a databází.
3.  Začít s implementací základní CAD vizualizace.
4.  Vyvinout základní funkce pro správu dokumentů.
5.  Zavést jednotný systém pro logování napříč moduly.
