# QA Kontrolní seznam: Import a Export projektu (v29)

Tento dokument slouží k ověření správné funkčnosti importu a exportu projektových dat v rámci LOSKOT FVE & LPS STUDIO PRO v29.

## Cíle testování

*   Ověřit bezchybný import a export projektů různých stavů a verzí.
*   Zajistit integritu dat během přenosu mezi různými formáty a verzemi.
*   Ověřit správné zpracování chybových stavů.

## Testovací scénáře

| Test ID | Popis testu                                     | Očekávaný výsledek                                                                 | Skutečný výsledek | Stav (Pass/Fail) | Poznámky |
| :------ | :---------------------------------------------- | :--------------------------------------------------------------------------------- | :---------------- | :--------------- | :------- |
| IE-001  | Import validního JSON souboru (plný projekt)    | Projekt úspěšně naimportován, všechna data správně načtena.                          |                   |                  |          |
| IE-002  | Import validního JSON souboru (minimální projekt) | Projekt úspěšně naimportován, všechna data správně načtena.                          |                   |                  |          |
| IE-003  | Import nevalidního JSON souboru                 | Chyba importu, uživatel informován o problému se strukturou JSON.                  |                   |                  |          |
| IE-004  | Import JSON starší verze (např. v21)            | Projekt úspěšně naimportován, data migrována do v29 schématu, `migrationHistory` aktualizováno. |                   |                  |          |
| IE-005  | Kontrola `migrationHistory` po importu          | `migrationHistory` obsahuje záznamy odpovídající provedeným migracím.               |                   |                  |          |
| IE-006  | Export plného projektu                          | Exportovaný JSON obsahuje všechna data projektu dle schématu v29.                   |                   |                  |          |
| IE-007  | Export části projektu (např. pouze FVE)         | Exportovaný JSON obsahuje pouze vybranou část projektu dle schématu v29.           |                   |                  |          |
| IE-008  | Kontrola manifestu v exportovaném souboru       | Manifest obsahuje správné informace o projektu (verze, datum, atd.).               |                   |                  |          |
| IE-009  | Kontrola checksum polí v exportu                | Checksumy jsou vypočítány a uloženy správně.                                        |                   |                  |          |
| IE-010  | Kontrola exportu QA výsledků                    | Exportovaný JSON obsahuje správné QA výsledky.                                      |                   |                  |          |
| IE-011  | Kontrola exportu warningů                       | Exportovaný JSON obsahuje všechny varování vygenerovaná během operací.            |                   |                  |          |
| IE-012  | Test rollbacku při chybě importu                | V případě chyby importu se projekt neuloží nebo se vrátí do předchozího stavu.        |                   |                  |          |
| IE-013  | Export nemění původní projekt                   | Po exportu zůstává původní projekt v nezměněném stavu.                              |                   |                  |          |
| IE-014  | Import projektu s geometrickými daty střechy    | Projekt s geometrií střechy je správně naimportován a data jsou konzistentní.       |                   |                  |          |
| IE-015  | Import projektu s QA warningy                   | Projekt s QA warningy je správně naimportován a warningy jsou zaznamenány.          |                   |                  |          |

## Postup pro provedení testů

1.  Připravte testovací JSON soubory (validní, nevalidní, starší verze).
2.  Pro každý testovací scénář proveďte odpovídající akci (import/export).
3.  Zaznamenejte očekávaný výsledek.
4.  Po provedení akce zaznamenejte skutečný výsledek.
5.  Vyplňte stav testu (Pass/Fail).
6.  V případě selhání doplňte poznámky k analýze problému.

## Závěr

Po úspěšném provedení všech testů s výsledkem "Pass" je funkce importu a exportu považována za funkční.
