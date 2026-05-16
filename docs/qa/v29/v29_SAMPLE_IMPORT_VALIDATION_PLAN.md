# Plán validace importu vzorových projektů (v29)

## 1. Účel

Tento dokument popisuje plán testování pro validaci importu vzorových JSON projektů do datového modelu v29. Cílem je zajistit správnou funkci importního procesu, konzistenci dat a detekci očekávaných varování a chyb.

## 2. Testované soubory

Budou importovány a validovány následující vzorové projekty:

*   `v29_minimal_project.json`
*   `v29_full_fve_lps_project.json`
*   `v29_roof_geometry_project.json`
*   `v29_qa_warning_project.json`

## 3. Kontrola syntaxe JSON

Před importem bude u každého souboru zkontrolována syntaxe JSON pomocí standardních nástrojů nebo online validátorů. Očekává se, že všechny soubory budou mít validní JSON syntaxi.

## 4. Kontrola JSON schémat

Každý importovaný projekt bude validován proti příslušným JSON schématům definovaným pro verzi v29 datového modelu. Tím se ověří struktura a datové typy jednotlivých polí.

## 5. Kontrola referencí

Budou ověřeny interní reference mezi entitami projektu (např. propojení střechy s budovou, stringů s panely, LPS komponent s objekty).

## 6. Kontrola `migrationHistory`

Pole `migrationHistory` bude zkontrolováno na správné formátování a přítomnost aktuální verze datového modelu.

## 7. Kontrola QA výsledků

Pro projekty obsahující sekci `qa` (např. `v29_qa_warning_project.json`) budou validovány uvedené QA statusy, varování a zprávy.

## 8. Kontrola SQLite mapování

V rámci testování importu bude implicitně ověřeno, jak se JSON struktura mapuje na navržené SQLite tabulky (dle `docs/database/v29/v29_JSON_TO_SQLITE_MAPPING.md`).

## 9. Očekávané warningy

Některé vzorové projekty jsou navrženy tak, aby generovaly specifická varování (např. `v29_qa_warning_project.json`). Tato varování budou zaznamenána a porovnána s očekávaným výstupem.

## 10. Očekávané error stavy

Očekáváme, že při importu dojde k chybám v případě, že soubor není validní JSON nebo neodpovídá schématu (pokud není chyba záměrně vytvořena pro testování konkrétního scénáře).

## 11. Postup ručního testu

1.  Připravit testovací prostředí s aplikací podporující import v29.
2.  Pro každý vzorový JSON soubor:
    a.  Spustit proces importu.
    b.  Sledovat výstupní logy a uživatelské rozhraní.
    c.  Zaznamenat případné chyby, varování a jejich detaily.
    d.  Porovnat výsledek s očekáváními.

## 12. Tabulka testování

| Testovaný soubor                     | Očekávání                                                                                                | Výsledek    | Stav      | Poznámka                                      |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------- | :---------- | :-------- | :-------------------------------------------- |
| `v29_minimal_project.json`           | Úspěšný import, validní JSON, odpovídá schématu, správná `migrationHistory`.                                |             |           |                                               |
| `v29_full_fve_lps_project.json`      | Úspěšný import, validní JSON, odpovídá schématu, správná `migrationHistory`, očekáváno varování u FVE.      |             |           |                                               |
| `v29_roof_geometry_project.json`     | Úspěšný import, validní JSON, odpovídá schématu, správná `migrationHistory`, vizuální kontrola geometrie. |             |           |                                               |
| `v29_qa_warning_project.json`        | Úspěšný import, validní JSON, odpovídá schématu, správná `migrationHistory`, detekce očekávaných QA warningů. |             |           |                                               |
| **Celková validace syntaxe**         | Všechny soubory musí být validní JSON.                                                                    |             |           |                                               |
| **Celková validace schémat**         | Všechny soubory musí projít validací proti v29 schématům.                                                |             |           |                                               |
| **Validace referencí**              | Všechny reference mezi entitami musí být platné.                                                         |             |           |                                               |
| **Kontrola `migrationHistory`**      | Každý projekt musí obsahovat platnou `migrationHistory`.                                                 |             |           |                                               |
| **Kontrola QA sekcí**                | Warningy a statusy v `qa` sekci musí být správně zpracovány.                                              |             |           |                                               |
