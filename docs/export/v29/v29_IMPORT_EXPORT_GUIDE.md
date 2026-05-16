# Průvodce importem a exportem dat v LOSKOT FVE & LPS STUDIO PRO v29

## 1. Účel import/export vrstvy

Importní a exportní vrstva slouží jako rozhraní pro přenos dat projektu mezi LOSKOT FVE & LPS STUDIO PRO a externími systémy nebo pro archivaci. Umožňuje snadnou výměnu dat v standardizovaném formátu JSON, zajišťuje integritu dat a poskytuje mechanismy pro správu verzí a kontrolu chyb.

## 2. Import JSON projektu

Tato funkce umožňuje načíst projekt z JSON souboru.
- **Proces:** Uživatel vybere JSON soubor projektu. Aplikace validuje soubor proti příslušnému JSON schématu (`project-export-contract.json`).
- **Preview/Confirm:** Před finálním importem se zobrazí náhled změn a uživatel musí potvrdit import.
- **Chybové hlášky:** V případě nevalidního JSON nebo nesplnění kontraktu se zobrazí podrobné chybové hlášky.
- **Rollback:** V případě chyby během importu se provede rollback na předchozí stav projektu.

## 3. Export JSON projektu

Umožňuje uložit aktuální stav projektu do JSON souboru.
- **Proces:** Systém serializuje data projektu do JSON formátu dle `project-export-contract.json`.
- **Výběr dat:** Uživatel může volitelně vybrat, které části projektu budou exportovány.

## 4. Export dokumentačního balíčku

Tato funkce vytváří archiv (např. ZIP) obsahující veškeré dokumenty projektu.
- **Proces:** Systém shromáždí všechny soubory definované v sekci `dokumenty` datového modelu a zabalí je do jednoho archivu.
- **Manifest:** Exportní balíček obsahuje manifest (`manifest.json`) popisující obsah balíčku.

## 5. Export QA výsledků

Umožňuje exportovat výsledky kontroly kvality projektu.
- **Proces:** Systém serializuje data z QA modulu podle `qa-result-contract.json`.
- **Formát:** Obvykle JSON, připravený pro další analýzu nebo archivaci.

## 6. Export CAD náhledu

Funkce exportuje aktuální vizualizaci CAD modulu.
- **Formát:** Může být ve formátu obrázku (PNG, JPG) nebo jako samostatný SVG soubor.

## 7. Vazba na SQLite

Importní a exportní vrstva spolupracuje s datovou vrstvou SQLite. JSON data jsou parsována a ukládána do SQLite databáze a naopak. Schéma databáze je definováno v SQL souborech a mapování JSON na SQL je klíčové.

## 8. Vazba na JSON schémata

Veškeré operace importu a exportu jsou striktně řízeny pomocí JSON schémat. Tato schémata definují strukturu a datové typy pro každý typ datového objektu (projekt, FVE, LPS, dokumenty atd.) a zajišťují kompatibilitu napříč verzemi.

## 9. Chování při chybě

Při jakékoli chybě během importu nebo exportu (např. nevalidní JSON, chyba zápisu na disk, selhání databázové operace) musí systém:
- Zobrazit jasnou a srozumitelnou chybovou zprávu uživateli.
- Zajistit, aby nedošlo k poškození existujících dat projektu (viz Rollback pravidla).

## 10. Preview/confirm krok při importu

Před finálním provedením importu dat se uživateli zobrazí rekapitulace importovaných dat a případných konfliktů nebo nahrazených položek. Uživatel musí explicitně potvrdit provedení importu.

## 11. Rollback pravidla

V případě, že importní proces selže v jakémkoli bodě po úvodním potvrzení, musí systém automaticky vrátit všechny provedené změny a obnovit projekt do stavu před zahájením importu. Toto platí pro změny v databázi i pro případné změny souborů.

## 12. Manifest exportního balíčku

Exportní balíček (např. ZIP archiv) musí obsahovat soubor `manifest.json`, který popisuje obsah balíčku:
- Verze aplikace při exportu.
- Datum a čas exportu.
- Seznam exportovaných souborů (včetně dokumentů, CAD náhledu, QA výsledků).
- Kontrolní součty souborů (např. SHA256).

## 13. Doporučený postup pro neprogramátora

1.  **Export:** Použijte funkci "Exportovat projekt" a vyberte požadované položky. Uložte soubor na bezpečné místo. Pro export dokumentů použijte "Export dokumentačního balíčku".
2.  **Import:** Použijte funkci "Importovat projekt", vyberte připravený JSON soubor. Pečlivě zkontrolujte náhled a potvrďte import. V případě chyb kontaktujte technickou podporu.

## 14. QA checklist před exportem

Před provedením exportu projektu se ujistěte, že:
- Projekt je ve stabilním stavu.
- Všechna data jsou kompletní a správná.
- Byly provedeny a vyhodnoceny všechny relevantní QA kontroly.
- Nejsou aktivní žádná varování, která by mohla ovlivnit integritu exportu.

## 15. Rizika

- **Poškození dat:** Chyby v importním procesu mohou vést k nekonzistentním datům nebo úplnému poškození projektu.
- **Nekompatibilita verzí:** Import souborů z výrazně starších nebo budoucích verzí aplikace nemusí být možný bez migrace.
- **Ztráta dat:** Nesprávné použití rollback mechanismu nebo přerušení procesu může vést ke ztrátě dat.
- **Velké soubory:** Export/import velkých projektů nebo balíčků dokumentů může být časově náročný a náročný na zdroje.
