# Pravidla pro QA semafor (Traffic Light) v29

## Účel QA semaforu

QA semafor vizualizuje stav kvality dat a funkčnosti projektu LOSKOT FVE & LPS STUDIO PRO. Poskytuje rychlý přehled o celkovém stavu projektu a umožňuje identifikovat oblasti vyžadující pozornost.

## Stavy

*   **OK (Zelená):** Všechny kontroly prošly úspěšně. Data jsou v pořádku a funkčnost je bezchybná.
*   **WARNING (Oranžová):** Byly zjištěny drobné nesrovnalosti nebo potenciální problémy, které nevyžadují okamžitou opravu, ale měly by být zaznamenány a případně řešeny v budoucnu.
*   **ERROR (Červená):** Byly zjištěny závažné chyby, které ovlivňují funkčnost nebo integritu dat. Vyžaduje okamžitou opravu.
*   **CRITICAL (Fialová):** Kritické chyby, které znemožňují použití aplikace nebo dat. Vyžaduje okamžitou a prioritní opravu.
*   **PENDING (Šedá):** Kontrola nebyla provedena nebo její výsledek není znám.

## Výpočet celkového stavu projektu

Celkový stav projektu je určen nejhorším stavem kteréhokoli z jeho modulů nebo kontrol. Například, pokud je FVE modul v stavu ERROR, celý projekt je označen jako ERROR, i když ostatní moduly jsou OK.

## Priorita chyb

Chyby jsou prioritizovány podle jejich závažnosti: CRITICAL > ERROR > WARNING.

## QA pravidla pro moduly

### FVE

*   **Data:** Kontrola úplnosti a správnosti dat FVE panelů, stringů, měničů. Validace parametrů vůči normám.
*   **Výpočty:** Ověření správnosti základních FVE výpočtů (kWp, DC výkon).
*   **Integrace:** Kontrola propojení FVE dat s ostatními moduly (např. objekt, střecha).

### LPS / DEHN

*   **Data:** Kontrola úplnosti a správnosti dat jímací soustavy, svodů, pospojování, ochrany před bleskem (SPD).
*   **Výpočty:** Ověření rizikových analýz a návrhu LPS dle norem.
*   **Integrace:** Kontrola propojení LPS dat s ostatními moduly (např. objekt, CAD).

### CAD / Mapa

*   **Data:** Kontrola úplnosti a správnosti geometrických dat objektů, střech, umístění komponent.
*   **Zobrazení:** Ověření správného vykreslení vrstev (FVE, LPS, zemnění).
*   **Integrace:** Kontrola propojení CAD dat s ostatními moduly.

### Dokumenty

*   **Data:** Kontrola existence a úplnosti požadovaných dokumentů (PDF, DOCX).
*   **Typy:** Validace typů dokumentů.

### Exporty

*   **Data:** Kontrola úplnosti a formátu exportovaných dat (JSON, CSV).
*   **Konzistence:** Ověření konzistence exportovaných dat s daty v projektu.

### SQLite

*   **Schéma:** Validace SQLite schématu vůči definovaným kontraktům.
*   **Data:** Kontrola integrity dat uložených v SQLite databázi.
*   **Indexy:** Ověření existence a správnosti indexů pro výkon.

### Importy

*   **Formát:** Validace formátu importovaných souborů (JSON).
*   **Obsah:** Kontrola úplnosti a správnosti dat v importovaném souboru.
*   **Chyby:** Detekce a hlášení chyb při importu.

## Zobrazování chyb uživateli

Chyby a varování se zobrazují v rozhraní aplikace prostřednictvím vizuálních indikátorů (např. ikony semaforu, červené/oranžové podbarvení polí, chybové hlášky).

## Zabránění bílé obrazovce

Aplikace musí obsahovat globální zachytávání chyb a bezpečné vykreslování modulů, aby se zabránilo zhroucení aplikace a zobrazení bílé obrazovky.

## Logování QA výsledku

Výsledky všech QA kontrol se ukládají do logovacích souborů a/nebo do SQLite databáze pro pozdější analýzu a audit.

## Checklist

*   [ ] Všechny moduly prošly kontrolou stavu OK?
*   [ ] Nejsou v projektu žádné chyby stavu ERROR nebo CRITICAL?
*   [ ] Jsou všechna varování (WARNING) zaznamenána a zvážena pro budoucí řešení?
*   [ ] Je celkový stav projektu správně vyhodnocen?
*   [ ] Jsou výsledky QA exportovány nebo logovány pro audit?
