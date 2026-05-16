# Průvodce vzorovými projekty (v29)

Tento dokument popisuje účel a použití vzorových JSON projektů pro datový model verze v29 aplikace LOSKOT FVE & LPS STUDIO PRO. Tyto projekty slouží jako referenční data pro testování, demonstraci funkcí a jako základ pro nové zakázky.

## 1. Účel vzorových projektů

*   **Demonstrace:** Ukazují strukturu a obsah datového modelu pro různé scénáře.
*   **Testování:** Umožňují ověření funkčnosti importu, exportu, QA semaforu, CAD/mapových modulů a databázových operací.
*   **Referenční data:** Poskytují příklady pro uživatele a vývojáře.
*   **Základ pro nové projekty:** Slouží jako šablony pro rychlé vytvoření nové zakázky.

## 2. `v29_minimal_project.json`

*   **Popis:** Minimální projekt obsahující pouze základní informace o projektu, budově a střeše. FVE a LPS moduly jsou prázdné nebo s minimálními daty.
*   **Použití:** Ideální pro testování základní struktury projektu, importu/exportu a ověření povinných polí datového modelu.

## 3. `v29_full_fve_lps_project.json`

*   **Popis:** Komplexní projekt obsahující data pro FVE i LPS systémy, včetně panelů, stringů, měničů, svodů, zemnění atd. Obsahuje také ukázku CAD vrstev a QA záznamů.
*   **Použití:** Vhodný pro testování všech klíčových modulů (FVE, LPS, CAD, QA), ověření propojení mezi komponentami a komplexní import/export.

## 4. `v29_roof_geometry_project.json`

*   **Popis:** Projekt zaměřený na detailní geometrii střechy, včetně definice rovin, FVE panelů a LPS prvků na střeše.
*   **Použití:** Důležitý pro testování CAD a mapových modulů, vizualizaci geometrických dat a validaci prostorových vztahů.

## 5. `v29_qa_warning_project.json`

*   **Popis:** Projekt obsahující záměrně vygenerovaná QA varování a upozornění v různých modulech (FVE, LPS, SPD, CAD, exporty).
*   **Použití:** Klíčový pro testování funkčnosti QA semaforu, ověření zpracování varování a upozornění a jejich zobrazení v rozhraní.

## 6. Použití pro import

Vzorové projekty lze importovat přímo do aplikace přes funkci Import projektu. Slouží k ověření správnosti importního procesu a datové konzistence.

## 7. Použití pro export

Export projektu z aplikace by měl generovat JSON soubor, který je strukturálně shodný s jedním z vzorových projektů (dle zvoleného rozsahu). Slouží k ověření funkčnosti exportu.

## 8. Použití pro SQLite

Vzorové projekty mohou sloužit jako vstupní data pro migraci do SQLite databáze. Jejich struktura definuje očekávané tabulky a pole.

## 9. Použití pro QA semafor

`v29_qa_warning_project.json` je specificky navržen pro testování QA semaforu. Import tohoto projektu by měl vyvolat různá QA upozornění a varování.

## 10. Použití pro test CAD/mapa

Projekty `v29_full_fve_lps_project.json` a `v29_roof_geometry_project.json` obsahují data pro CAD vrstvy a objekty, které lze využít pro testování vykreslování a interakce v CAD/mapovém modulu.

## 11. Očekávané výsledky

*   Úspěšný import a export projektů bez chyb.
*   Správné zobrazení a interakce v CAD/mapovém modulu.
*   Korektní vyhodnocení QA stavu a zobrazení varování/upozornění.
*   Validní datová struktura pro budoucí SQLite integraci.

## 12. Rizika a omezení

*   Vzorové projekty nemusí pokrývat všechny myslitelné scénáře.
*   Data jsou fiktivní a neslouží pro reálné technické návrhy.
*   Struktura se může mírně lišit v závislosti na přesné verzi datového modelu.

## 13. Doporučení pro další vývoj

*   Rozšiřovat portfolio vzorových projektů o další specifické případy (např. složité LPS systémy, speciální typy střech).
*   Automatizovat testování importu/exportu pomocí těchto vzorových projektů.
*   Vytvořit validátory JSON schémat pro každý vzorový projekt.

---
*Datum vytvoření: 2026-05-16*
*Verze datového modelu: v29*
