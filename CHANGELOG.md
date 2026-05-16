# CHANGELOG

## v21 SHARED PROJECT MODEL

- Navázáno na `v20 UNIFIED APP FOUNDATION`.
- Zachován Classic PRO tmavý vzhled.
- Zachováno levé menu a funkční přepínání obrazovek.
- Zvýrazněno, že aplikace je společný FVE + LPS program, ne pouze LPS/hromosvodový nástroj.
- Přidán sdílený projektový datový model.
- Datový model rozdělen na části: zakázka, objekt, střecha, FVE, LPS, SPD, LPZ, CAD, dokumenty, databáze a exporty.
- Přidána samostatná obrazovka `Sdílený model`.
- Přidána ukázková data projektu.
- Přidán JSON vzor projektu do `/database/sample-projects`.
- Doplněn JSON import s kontrolou povinných sekcí.
- Zachován JSON export projektu.
- Project Inspector je napojený na sdílený model.
- QA semafor byl upraven pro v21.
- CAD preview nově popisuje společné vrstvy FVE + LPS + LPZ + zemnění.
- Doplněna příprava SQLite tabulek.
- Doplněna příprava budoucí React/Tauri struktury.
- Zachována ochrana proti bílé obrazovce pomocí globálního zachytávání chyb a bezpečného vykreslení modulu.

## v20 UNIFIED APP FOUNDATION

- Vytvořen první sjednocený základ programu LOSKOT FVE & LPS STUDIO PRO.
- Přidán samostatný HTML preview soubor na dvojklik.
- Zachován směr Classic PRO tmavého rozhraní.
- Přidáno levé modulové menu.
- Přidán Dashboard.
- Přidán Project Inspector.
- Přidán QA semafor.
- Přidán FVE modul se základním výpočtem kWp.
- Přidán LPS / DEHN modul jako základ pro další migraci.
- Přidán SPD / LPZ modul.
- Přidán CAD / Mapa modul.
- Obnovena mapa alespoň jako technický placeholder.
- Přidán JSON export projektu.
- Přidána ochrana proti bílé obrazovce.

## v22 REACT TAURI SCAFFOLD - plán

- Převést HTML preview do čisté React struktury.
- Oddělit datový model do samostatného modulu.
- Oddělit FVE/LPS/SPD/LPZ/CAD moduly.
- Připravit Tauri-ready adresářovou strukturu.
- Připravit SQLite adapter bez ostrého zápisu do databáze.
