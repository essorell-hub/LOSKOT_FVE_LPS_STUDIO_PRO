# Mapování JSON na SQLite v LOSKOT FVE & LPS STUDIO PRO v29

## Účel mapování

Tento dokument popisuje mapování datové struktury z JSON formátu do relační databáze SQLite. Cílem je definovat vztahy mezi jednotlivými klíči v JSON exportu projektu a tabulkami v SQLite databázi, která slouží jako pracovní úložiště pro desktopovou aplikaci.

## Zásady

-   **JSON fallback:** JSON soubory zůstávají primárním zdrojem pro přenositelnost dat a zálohování.
-   **SQLite úložiště:** SQLite databáze slouží jako efektivní pracovní databáze pro rychlý přístup a zpracování dat v rámci Windows aplikace.

## Mapování datových struktur

Následující tabulka uvádí přehled mapování JSON polí na SQLite tabulky.

| JSON Path (Ukázka)              | SQLite Tabulka       | Hlavní klíč / Relace        | Poznámka                                     |
| :------------------------------ | :------------------- | :-------------------------- | :------------------------------------------- |
| `projectInfo`                   | `projects`           | `project_id` (PK)           | Základní informace o projektu                |
| `building`                      | `buildings`          | `building_id` (PK), FK `project_id` | Informace o budově                           |
| `roofs`                         | `roofs`              | `roof_id` (PK), FK `building_id`   | Střechy                                      |
| `roofs[*].planes`               | `roof_planes`        | `plane_id` (PK), FK `roof_id`    | Jednotlivé roviny střechy                    |
| `fve.panels`                    | `fve_panels`         | `panel_id` (PK), FK `project_id` |                                              |
| `fve.strings`                   | `fve_strings`        | `string_id` (PK), FK `project_id`  |                                              |
| `fve.inverters`                 | `inverters`          | `inverter_id` (PK), FK `project_id` |                                              |
| `lps`                           | `lps_components`     | `lps_component_id` (PK), FK `project_id` | Komponenty ochrany před bleskem             |
| `cad.layers[*].objects[*]`      | `cad_objects`        | `cad_object_id` (PK), FK `project_id` | Objekty v CAD                                |
| `documents[*]`                  | `documents`          | `document_id` (PK), FK `project_id` | Dokumenty a datové listy                     |
| `exports[*]`                    | `exports`            | `export_id` (PK), FK `project_id`  | Definice exportů                             |
| `qa.checks[*]`                  | `qa_checks`          | `qa_check_id` (PK), FK `project_id` | Kontroly kvality                             |
| `auditLog[*]`                   | `audit_log`          | `log_id` (PK), FK `project_id`   | Historie změn                                |

## Importní postup

1.  Načtení JSON souboru projektu.
2.  Provedení validace JSON proti příslušnému schématu.
3.  Iterace přes JSON data a vkládání/aktualizace záznamů do odpovídajících SQLite tabulek. Použití `UPSERT` (INSERT OR REPLACE) pro zajištění konzistence.
4.  Správa cizích klíčů pro udržení integrity dat.

## Exportní postup

1.  Načtení dat z jednotlivých SQLite tabulek spojených s daným projektem.
2.  Skládání dat do původní JSON struktury podle definovaného mapování.
3.  Uložení výsledného JSON souboru.

## Rizika a doporučení

-   **Datová nekonzistence:** Důsledná validace JSON a správné ošetření cizích klíčů při importu do SQLite.
-   **Výkon importu/exportu:** Optimalizace SQL dotazů, případně použití dávkového zpracování.
-   **Verzování schématu:** Implementace migračních skriptů pro SQLite (viz `database/sqlite/v29/`).
-   **Správa velkých dat:** Zvážení limitů pro zpracování velkých JSON souborů a objemných databází.

---
*Poslední aktualizace: 2026-05-16*
