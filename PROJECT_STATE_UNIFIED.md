# PROJECT_STATE_UNIFIED

## Projekt

LOSKOT FVE & LPS STUDIO PRO

## Aktuální verze

v20 UNIFIED APP FOUNDATION

## Stav

Repozitář byl inicializován a v20 vytváří první sjednocený základ aplikace.

## Hlavní cíl

Jeden společný program pro FVE, LPS/DEHN, SPD/LPZ, CAD/mapu, dokumenty, databáze zařízení, exporty a pozdější Windows aplikaci.

## Zdrojové větve

### FVE část

LOSKOT FVE Studio PRO slouží jako zdroj pro:

- datový model zakázky,
- Project Inspector,
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
- mapu a technický náhled.

## Nezrušit / nepoškodit

- Classic PRO tmavý vzhled.
- Levé menu.
- Dashboard.
- Project Inspector.
- CAD preview.
- Mapa nebo její technický placeholder.
- Automatické náhledy.
- JSON export.
- Ochrana proti bílé obrazovce.

## Cílové moduly

- Dashboard
- Project Inspector
- FVE
- LPS / DEHN
- SPD / LPZ
- CAD / Mapa
- Dokumenty
- Databáze
- Exporty
- Nastavení

## Stav v20

Hotovo:

- samostatný HTML preview soubor na dvojklik,
- Classic PRO dark shell,
- funkční přepínání modulů,
- sjednocený datový model projektu,
- Project Inspector,
- QA semafor,
- CAD SVG preview,
- mapa jako technický placeholder,
- JSON export,
- ochrana proti bílé obrazovce.

Není hotovo:

- skutečný import starých HTML zdrojů,
- plné normové výpočty,
- SQLite databáze,
- React/Tauri build,
- práce s reálnými mapovými podklady,
- dokumentové šablony.

## Další verze

v21 SHARED PROJECT MODEL

Cíl:

- rozdělit projektový model do samostatných částí,
- připravit JSON schema,
- připravit import/export projektu,
- navrhnout SQLite tabulky,
- připravit React komponentovou strukturu.
