# v29 DATAVERZIONING A MIGRACE DAT

Tento dokument popisuje strategii pro verzování datového modelu a provádění migrací v projektu LOSKOT FVE & LPS STUDIO PRO. Cílem je zajistit hladký přechod mezi verzemi aplikace a datového modelu bez ztráty dat a s minimálním rizikem pro uživatele.

## 1. Účel verzování datového modelu

Verzování datového modelu je klíčové pro:
- Sledování změn ve struktuře dat napříč verzemi aplikace.
- Zajištění kompatibility dat starších verzí s novými verzemi aplikace.
- Umožnění řízeného přechodu (migrace) dat při změnách schématu.
- Podporu zpětné kompatibility a snadného importu starších datových souborů.

## 2. Rozdíl mezi `appVersion` a `dataModelVersion`

-   `appVersion`: Verze celé aplikace LOSKOT FVE & LPS STUDIO PRO. Určuje, která verze aplikace byla použita k vytvoření nebo poslední úpravě projektu.
-   `dataModelVersion`: Verze datového modelu, který projekt aktuálně používá. Tato verze se může lišit od `appVersion` a obvykle se zvyšuje, když dojde ke změnám ve struktuře dat, které vyžadují migraci (např. přidání, odstranění nebo přejmenování polí v JSON struktuře projektu).

## 3. Doporučená pole v projektu

Každý projekt (ideálně v kořenovém objektu JSON) by měl obsahovat následující pole:

-   `dataModelVersion` (string): Aktuální verze datového modelu projektu. Příklad: `"v29"`.
-   `appVersion` (string): Verze aplikace, která naposledy upravovala tento projekt. Příklad: `"v21"`.
-   `createdAt` (string): Datum a čas vytvoření projektu (ISO 8601 formát). Příklad: `"2026-05-16T10:30:00Z"`.
-   `updatedAt` (string): Datum a čas poslední aktualizace projektu (ISO 8601 formát). Příklad: `"2026-05-16T11:00:00Z"`.
-   `migrationHistory` (array): Historie provedených migrací datového modelu. Každá položka by měla obsahovat verzi, na kterou byla migrace provedena, datum a čas provedení a případně popis.
    Příklad položky:
    ```json
    {
      "version": "v29",
      "migratedAt": "2026-05-16T11:00:00Z",
      "description": "Initial data model versioning setup"
    }
    ```

## 4. Pravidlo: Starý projekt se nesmí rozbít

Aplikace musí být schopna načíst a bezpečně zpracovat projekty z předchozích verzí, i když nemají všechna nová pole nebo mají starší `dataModelVersion`.

## 5. Pravidlo: Chybějící pole doplnit výchozí hodnotou

Pokud aplikace narazí na projekt s `dataModelVersion` nižším, než je aktuální verze datového modelu aplikace, a projekt neobsahuje nově přidané pole, musí aplikace toto pole doplnit vhodnou výchozí hodnotou.
Příklad výchozí hodnoty pro chybějící modul:
```json
{
  "fve": {
    "dataModelVersion": "v29",
    "appVersion": "v21",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "migrationHistory": [],
    // ... další FVE data ...
    "pv_arrays": [], // Příklad default hodnoty pro chybějící pole
    "inverters": []
  }
}
```

## 6. Pravidlo: Neznámá pole nezahazovat bez varování

Pokud aplikace narazí na pole, která nejsou definována v aktuálním datovém modelu, neměla by je bezdůvodně zahodit. Měla by je buď ignorovat, nebo ideálně zaznamenat varování do logu, aby uživatel věděl, že se v datech nachází neznámé informace.

## 7. Pravidlo: Každá migrace musí být idempotentní

Migrační skript nebo logika musí být navržena tak, aby její opakované spuštění na stejných datech nemělo žádný další efekt. To zabraňuje problémům při případných opakovaných pokusech o migraci.

## 8. Migrace v28 → v29

-   Přidání pole `dataModelVersion` do kořenového objektu projektu, pokud chybí. Nastavit na `"v29"`.
-   Přidání pole `migrationHistory` do kořenového objektu projektu, pokud chybí. Inicializovat jako prázdné pole `[]`.
-   Přidání záznamu o této migraci do `migrationHistory`.
-   Zpracování změn specifických pro v29 moduly (viz níže).

## 9. Migrace v29 → v30

-   (Bude definováno v budoucí dokumentaci pro v30.)

## 10. Migrace JSON fallbacku

Pokud aplikace narazí na projekt bez definovaného `dataModelVersion`, měla by se pokusit odhadnout jeho verzi na základě obsahu nebo použít výchozí hodnoty a spustit potřebné migrace, případně informovat uživatele o nutnosti manuální kontroly.

## 11. Migrace SQLite vrstvy

Při přechodu na SQLite databázi budou migrace datového modelu řídit vytváření a úpravy tabulek, indexů a omezení. Tato logika musí být úzce propojena s verzováním datového modelu.

## 12. Jak řešit přejmenovaná pole

Staré pole se dočasně ponechá a jeho hodnota se při migraci zkopíruje do nového pole. Staré pole může být v další verzi datového modelu odstraněno.

## 13. Jak řešit odstraněná pole

Odstraněná pole se z datového modelu odstraní. Aplikace by měla být schopna ignorovat tato pole při načítání starších dat.

## 14. Jak řešit nové moduly

Pokud se přidá nový modul (např. `qa`), musí být v migrační logice zajištěno, že tento modul bude přidán do projektu s výchozími hodnotami, pokud původní projekt tento modul neobsahuje.

## 15. Jak řešit FVE data

Změny v datové struktuře FVE modulů (např. přejmenování `pv_arrays` na `fve_arrays`) budou řešeny v rámci migračního procesu.

## 16. Jak řešit LPS/DEHN data

Analogicky k FVE datům, změny v LPS/DEHN datech budou řešeny migračními skripty.

## 17. Jak řešit CAD/mapa data

Změny v datech CAD/mapy budou také spravovány migracemi.

## 18. Jak řešit dokumenty a exporty

Struktura pro správu dokumentů a exportů bude verzována a migrována podle potřeby.

## 19. Jak řešit QA výsledky

Pokud se změní struktura ukládání QA výsledků, migrace zajistí jejich správné zpracování.

## 20. Návrh `migrationHistory` záznamu

```json
{
  "version": "v29",
  "migratedAt": "YYYY-MM-DDTHH:MM:SSZ",
  "description": "Popis provedené migrace (např. 'Added dataModelVersion and migrationHistory fields', 'Renamed pv_arrays to fve_arrays in FVE module')."
}
```

## 21. Doporučený postup importu staršího projektu

1.  Načti JSON soubor projektu.
2.  Zkontroluj přítomnost `dataModelVersion`. Pokud chybí, pokus se odhadnout nebo použij výchozí.
3.  Porovnej `dataModelVersion` projektu s aktuální verzí datového modelu aplikace (`v29`).
4.  Pokud je `dataModelVersion` projektu nižší, spusť sekvenčně migrační skripty pro každou verzi od `dataModelVersion` projektu až po `v29`.
5.  Po úspěšné migraci aktualizuj `dataModelVersion` projektu na `"v29"` a `updatedAt`.
6.  Přidej záznam o provedené migraci do `migrationHistory`.

## 22. Doporučený postup exportu po migraci

Po provedení všech nutných migrací a úpravách dat:
1.  Nastav `updatedAt` na aktuální čas.
2.  Ulož projekt do JSON souboru. Tím se zajistí, že exportovaný soubor bude obsahovat nejnovější strukturu a verzi datového modelu.

## 23. Rizika migrací

-   **Ztráta dat:** Neúplné nebo chybné migrační skripty.
-   **Nekonzistence dat:** Chyby v logice migrace nebo při zpracování výjimek.
-   **Problémy s výkonem:** Pomalé migrace u velkých projektů.
-   **Nekompatibilita:** Migrace, která rozbije funkčnost aplikace.

## 24. Checklist před spuštěním migrace

- [ ] Záloha aktuálních dat projektu.
- [ ] Důkladná kontrola migračních skriptů.
- [ ] Testování migrace na vzorových datech.
- [ ] Oznámení uživateli o probíhající migraci.

## 25. Checklist po migraci

- [ ] Ověření `dataModelVersion` a `migrationHistory`.
- [ ] Kontrola klíčových dat v projektu.
- [ ] Spuštění aplikace a ověření základní funkčnosti.
- [ ] Kontrola logů aplikace na chyby.

## 26. Doporučení pro další krok: JSON Schema

Pro robustnější validaci datového modelu a definici migračních pravidel doporučujeme v další fázi definovat datový model pomocí JSON Schema. To umožní automatickou validaci dat a může pomoci při generování migračních skriptů.
