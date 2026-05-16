# Audit datové základny v29 - LOSKOT FVE & LPS STUDIO PRO

Tento dokument audituje stav datové základny projektu LOSKOT FVE & LPS STUDIO PRO k verzi v29.

## 1. Datový model v29

Datový model je komplexní a pokrývá všechny klíčové aspekty FVE a LPS systémů, včetně zakázky, objektu, střechy, FVE komponent (panely, stringy, měniče), LPS komponent (jímací soustava, svody, pospojování, zemnění), SPD, LPZ, CAD dat a dokumentů. Model je modulární a připravený pro budoucí rozšíření. Stav je stabilní a dobře zdokumentovaný v `docs/database/v29/v29_DATA_MODEL_MASTER_SPEC.md`.

## 2. JSON schémata

JSON schémata (v `database/schema/v29/`) detailně definují strukturu dat pro jednotlivé moduly. Zajišťují validaci dat při importu a exportu. Jsou konzistentní s datovým modelem a pokrývají všechny definované entity. Klíčové schema `shared-definitions.schema.json` umožňuje znovupoužití definic.

## 3. Sample projekty

Ukázkové projekty v `database/sample-projects/` (včetně `v29_full_fve_lps_project.json` a `v29_roof_geometry_project.json`) slouží jako referenční data pro testování a demonstraci funkčnosti. Jsou dobře strukturované a reprezentují reálné scénáře použití. Jsou klíčové pro QA a validaci importu/exportu.

## 4. SQLite návrh

Návrh SQLite databáze (v `database/sqlite/v29/`) je připraven pro budoucí implementaci. Zahrnuje inicializační skripty (`001_init_v29_schema.sql`), skripty pro tvorbu indexů (`002_indexes_v29.sql`) a skripty pro naplnění referenčních dat (`003_seed_v29_reference_data.sql`). Návrh je v souladu s datovým modelem a schématy.

## 5. Import/export kontrakty

Kontrakty pro import a export (v `database/contracts/v29/`) definují přesné formáty dat pro komunikaci s externími systémy a pro ukládání stavu projektu. Jsou klíčové pro zajištění integrity dat a zpětnou kompatibilitu. Pokrývají celý projekt, jednotlivé exporty a výsledky QA.

## 6. Validační pravidla

Validační pravidla, popsaná v `docs/validation/v29/`, zajišťují konzistenci a správnost dat v celém systému. Využívají JSON schémata a specifické validační logiky pro zajištění kvality dat. Jsou nezbytná pro robustnost aplikace.

## 7. QA pravidla

Pravidla pro zajištění kvality (QA) v `docs/qa/v29/` definují procesy a kritéria pro testování aplikace. Zahrnují QA checklisty pro datový model, import/export, testování vzorových projektů a pravidla pro QA semafor. Zajišťují odhalení chyb před nasazením.

## 8. Dokumentace

Klíčová dokumentace týkající se datového modelu, schémat, importu/exportu, validací a QA je přítomna v adresáři `docs/`. Je ucelená a poskytuje potřebný kontext pro vývoj a údržbu.

## 9. Připravenost pro v30

Datová základna pro v30 je solidní. Model, schémata a návrh databáze jsou připraveny. Fokus pro v30 by měl být na implementaci datové vrstvy, zejména SQLite, a na plynulé přechody z v29.

## 10. Rizika před implementací v30

- **Implementační složitost:** Přechod na SQLite a plné propojení s datovým modelem může být časově náročný.
- **Výkon:** Zajištění optimálního výkonu při práci s většími datovými sadami v SQLite.
- **Migrace dat:** Bezproblémová migrace stávajících dat (pokud existují) do nové SQLite struktury.
- **Konzistence:** Udržení konzistence mezi JSON reprezentací a SQLite databází.

## 11. Co se nesmí při v30 rozbít

- Funkčnost importu a exportu dat.
- Integrita datového modelu.
- Validace dat.
- Základní funkčnost aplikace (FVE, LPS, CAD, atd.).
- Ochrana proti bílé obrazovce.

## 12. Doporučený postup v30

1.  **Implementace SQLite:** Vytvořit plně funkční SQLite databázi dle návrhu.
2.  **Datová vrstva:** Vyvinout datovou vrstvu pro komunikaci s SQLite.
3.  **Integrace:** Propojit existující moduly s novou datovou vrstvou.
4.  **Testování:** Důkladně otestovat import, export a všechny operace s daty.
5.  **Optimalizace:** Zaměřit se na výkon databázových operací.
6.  **Iterace:** Postupovat inkrementálně a často testovat.

Tento audit potvrzuje silný základ pro další vývoj.
