# DATABASE INTEGRATION FOUNDATION (v31)

## Projekt: LOSKOT FVE & LPS STUDIO PRO

## Verze: v31 - Integrace databáze a pokročilých modulů

## Datum: 2026-05-16

## Cíl dokumentu

Tento dokument popisuje základní kámen pro integraci databázového úložiště do projektu LOSKOT FVE & LPS STUDIO PRO. Definuje přístup, strukturu a základní principy pro práci s daty napříč moduly. Cílem je vytvořit robustní, škálovatelné a snadno udržovatelné datové řešení.

## Přístup

Budeme se držet principu **"Jeden zdroj pravdy" (Single Source of Truth)** pro všechna projektová data. Data budou centralizována v databázi a moduly budou k nim přistupovat prostřednictvím definovaného API nebo ORM (Object-Relational Mapper).

## Navrhovaná struktura databáze (SQLite)

Následující tabulky představují základní návrh pro ukládání projektových dat. Tento návrh bude dále rozpracován a upraven podle potřeb jednotlivých modulů.

### Základní tabulky

*   `projects`: Hlavní tabulka pro ukládání informací o projektu (ID, název, metadata).
*   `objects`: Obecná tabulka pro objekty projektu (např. budovy, pozemky), která bude propojena s projektem.
*   `roofs`: Informace o střechách objektů (rozměry, orientace, sklon), propojené s `objects`.

### Modulově specifické tabulky

*   `pv_arrays`: Definice fotovoltaických polí (propojení s `projects` a `roofs`).
*   `pv_strings`: Informace o stringech panelů (propojení s `pv_arrays`).
*   `inverters`: Data o použitých střídačích (propojení s `projects`).
*   `lps_components`: Komponenty ochrany před bleskem (jímací soustava, svody, pospojení, uzemnění).
*   `spd_devices`: Přístroje pro ochranu proti přepětí.
*   `lpz_zones`: Zóny ochrany proti přepětí (Lightning Protection Zones).
*   `cad_objects`: Geometrická data a metadata pro CAD objekty (propojení s `projects` nebo specifickými moduly).
*   `documents`: Metadata o dokumentech souvisejících s projektem (název, typ, cesta k souboru).
*   `exports`: Definice a stav exportů projektu.
*   `qa`: Data pro systém kontroly kvality (QA semafor, výsledky testů).

## Přístup k datům

*   **Repository Pattern**: Pro každý typ datového záznamu bude implementována sada repozitářů, které budou zajišťovat přístup k datům (čtení, zápis, mazání).
*   **ORM (volitelné)**: Zvážíme použití ORM (např. TypeORM pro TypeScript nebo SQLAlchemy pro Python, pokud by se projekt rozšířil) pro zjednodušení interakce s databází. Prozatím se zaměříme na přímé SQL dotazy nebo jednodušší abstraktní vrstvu.
*   **Asynchronní operace**: Všechny databázové operace budou navrženy jako asynchronní, aby nedocházelo k blokování hlavního vlákna aplikace.

## Validace dat

*   **Při zápisu**: Před uložením dat do databáze budou provedeny validace na úrovni datového modelu a aplikační logiky.
*   **Integritní omezení**: Využití možností databáze pro vynucení referenční integrity (cizí klíče).

## Rizika

*   **Volba databáze**: Výběr databáze (SQLite pro lokální použití, PostgreSQL/MySQL pro serverové řešení) musí být proveden s ohledem na budoucí škálovatelnost.
*   **Migrace schématu**: Při změnách databázového schématu bude nutné implementovat mechanismus pro migraci dat, aby se předešlo ztrátě nebo poškození dat.
*   **Výkon**: Optimalizace dotazů a indexování tabulek bude klíčová pro zajištění dobrého výkonu.

## Další kroky

1.  Finalizovat návrh databázového schématu pro všechny moduly.
2.  Implementovat základní repozitáře pro hlavní tabulky (`projects`, `objects`).
3.  Připravit mechanismus pro migraci databázového schématu.
4.  Integrova databázový přístup do hlavních modulů (FVE, LPS, CAD).
