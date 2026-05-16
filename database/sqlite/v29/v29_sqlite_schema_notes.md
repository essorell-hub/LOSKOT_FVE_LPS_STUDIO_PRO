# Poznámky k SQLite schématu v29 pro LOSKOT FVE & LPS STUDIO PRO

## 1. Účel SQLite schématu

Tento soubor poskytuje přehled a dokumentaci k SQL skriptům použitým pro inicializaci a správu SQLite databáze v projektu LOSKOT FVE & LPS STUDIO PRO verze v29. Cílem je zajistit konzistentní a spolehlivou datovou vrstvu pro aplikaci.

## 2. Popis `001_init_v29_schema.sql`

Tento skript obsahuje příkazy `CREATE TABLE IF NOT EXISTS` pro definování struktury všech tabulek databáze. Zahrnuje:
- Základní projektové informace (`projects`, `buildings`).
- Geometrické údaje (`cadastral_info`, `roofs`, `roof_planes`, `roof_obstacles`).
- FVE komponenty (`fve_panels`, `fve_strings`, `inverters`, `optimizers`, `dc_routes`, `ac_routes`).
- LPS komponenty a ochranu (`lps_risk_assessments`, `lps_air_terminals`, `lps_downconductors`, `lps_hvi`, `earthing`).
- SPD a LPZ zóny (`spd_devices`, `lpz_zones`).
- CAD data (`cad_layers`, `cad_objects`).
- Dokumenty a exporty (`documents`, `datasheets`, `exports`).
- QA a auditní záznamy (`qa_checks`, `audit_log`).
- Nastavení aplikace (`app_settings`).
- Referenční hodnoty (`reference_values`).
`PRAGMA foreign_keys = ON;` zajišťuje vynucování referenční integrity.

## 3. Popis `002_indexes_v29.sql`

Tento skript definuje indexy pro zrychlení vyhledávání a spojování dat. Indexy jsou vytvořeny na `FOREIGN KEY` sloupce a často používané `WHERE` klauzule (např. `qa_status`, `created_at`). Použití `CREATE INDEX IF NOT EXISTS` zabraňuje chybám při opakovaném spuštění.

## 4. Popis `003_seed_v29_reference_data.sql`

Tento skript vkládá počáteční (referenční) data do tabulky `reference_values`. Tato data reprezentují standardní kategorie a hodnoty používané v aplikaci (např. typy LPS, statusy QA, typy dokumentů). `INSERT OR IGNORE` zajišťuje, že data nebudou duplikována při vícenásobném spuštění skriptu.

## 5. Jak spouštět SQL soubory

Tyto `.sql` soubory by měly být spouštěny v sekvenčním pořadí (001, 002, 003) pomocí SQLite klienta nebo programově z aplikace (např. pomocí Tauri). Je důležité zajistit, že se spustí pouze jednou při první inicializaci databáze.

## 6. Proč nepoužívat destruktivní DROP

Skripty záměrně nepoužívají `DROP TABLE`. Toto je bezpečnostní opatření proti náhodné ztrátě dat. `CREATE TABLE IF NOT EXISTS` zajistí, že tabulky budou vytvořeny pouze pokud neexistují.

## 7. Jak řešit migrace

Pro budoucí změny schématu budou vytvořeny nové migrační skripty (např. `004_migration_xxx.sql`). Tyto skripty budou postupně aplikovány. Doporučuje se verzování migrací a jejich spouštění v definovaném pořadí.

## 8. Jak řešit JSON fallback

V případě potřeby lze data v tabulkách snadno exportovat do JSON formátu (např. pomocí `SELECT * FROM tabulka FOR JSON AUTO;` v některých SQLite verzích nebo programově). V počáteční fázi může být JSON fallback použit jako dočasné řešení pro složitější struktury nebo zálohování.

## 9. Jak řešit chybu při inicializaci databáze

Pokud dojde k chybě při inicializaci (např. `PRAGMA foreign_keys` není podporován), je nutné zkontrolovat verzi SQLite a případně upravit skripty. Chybové hlášky z databázového enginu by měly být zachytávány a logovány v `audit_log`.

## 10. Doporučení pro Tauri/Windows

Pro Tauri/Windows aplikaci se doporučuje spouštět tyto skripty při prvním spuštění aplikace nebo při detekci neexistující či neaktuální databáze. Použití SQLite lze integrovat přímo do Tauri pomocí Rust backendu nebo přes JavaScript API.

## 11. Kontrolní checklist

- [x] Vytvořeny všechny hlavní tabulky.
- [x] Vynucena referenční integrita (`FOREIGN KEY`).
- [x] Vytvořeny relevantní indexy pro výkon.
- [x] Naplněna referenční data.
- [x] Vyhnuto se destruktivním `DROP` příkazům.
- [x] Zvážena budoucí migrace.
- [x] Zvážena integrace s Tauri/Windows.
````
