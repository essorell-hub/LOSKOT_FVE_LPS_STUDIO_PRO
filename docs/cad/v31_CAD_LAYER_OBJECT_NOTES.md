# CAD - Poznámky k vrstvám a objektům (v31)

## Projekt: LOSKOT FVE & LPS STUDIO PRO

## Verze: v31 - Integrace databáze a pokročilých modulů

## Datum: 2026-05-16

## Cíl dokumentu

Tento dokument shrnuje definice a principy týkající se vrstev (layers) a objektů v CAD modulu projektu LOSKOT FVE & LPS STUDIO PRO. Cílem je zajistit konzistentní správu a manipulaci s grafickými prvky v návrhovém prostředí.

## CAD Vrstvy (Layers)

Vrstvy slouží k organizaci a logickému seskupování CAD objektů. Každá vrstva má definované vlastnosti, které ovlivňují její zobrazení a chování.

### Základní definice vrstev (`layers` array)

Následující vrstvy jsou předdefinované a měly by být vždy přítomny v projektu. Každá vrstva má unikátní `id`, název (`name`) a výchozí stav zobrazení (`visible`) a uzamčení (`locked`).

*   **FVE Panely**: Vrstva pro FVE panely.
*   **FVE Stringy**: Vrstva pro vizualizaci stringů panelů.
*   **FVE Měniče**: Vrstva pro umístění měničů.
*   **LPS Jímací soustava**: Vrstva pro prvky jímací soustavy (svody, hroty).
*   **LPS Svody**: Vrstva pro hlavní svody LPS.
*   **LPS Pospřazení**: Vrstva pro pospojování a uzemnění.
*   **SPD/LPZ**: Vrstva pro prvky ochrany proti přepětí a zóny ochrany.
*   **Konstrukce střechy**: Vrstva pro zobrazení geometrie střechy.
*   **Referenční body**: Vrstva pro pomocné referenční body a osy.
*   **Poznámky/Texty**: Vrstva pro textové popisky a anotace.

### Správa vrstev

*   **`createDefaultCadLayers()`**: Funkce pro vytvoření sady výchozích vrstev s unikátními UUID pro každou instanci.
*   **`normalizeCadLayers(currentLayers)`**: Zajišťuje, že všechny předdefinované vrstvy existují v aktuálním seznamu vrstev a doplňuje chybějící vlastnosti z výchozích definic.
*   **`toggleLayerVisibility(currentLayers, layerId)`**: Přepíná viditelnost konkrétní vrstvy.
*   **`toggleLayerLock(currentLayers, layerId)`**: Přepíná stav uzamčení (zamknutí/odemknutí) vrstvy.
*   **`getLayerObjectCounts(currentLayers, allObjects)`**: Spočítá počet objektů přiřazených ke každé vrstvě.
*   **`getVisibleUnlockedLayers(currentLayers)`**: Vrací seznam vrstev, které jsou viditelné a odemčené.

## CAD Objekty (Objects)

Objekty jsou základními grafickými prvky v CAD modulu. Každý objekt je přiřazen k jedné vrstvě a má definovanou geometrii a vlastnosti.

### Vytváření objektů

*   **`createCadObject({ name, geometryType, geometry, layerId, properties })`**: Funkce pro vytvoření nového CAD objektu. Vyžaduje název, typ geometrie, geometrická data, ID vrstvy a volitelně další vlastnosti.
*   **Validace**: Kontrola povinných parametrů a podporovaných typů geometrie.

### Správa objektů

*   **`normalizeCadObject(cadObject, updateTimestamp)`**: Zajišťuje standardizovaný formát CAD objektu, přidává ID a časové značky, pokud chybí.
*   **`selectCadObject(currentObjects, objectId)`**: Označí jeden objekt jako vybraný.
*   **`clearCadSelection(currentObjects)`**: Zruší označení všech vybraných objektů.
*   **`moveCadObjects({ dx, dy })`**: Posune všechny označené objekty o danou hodnotu `dx` a `dy`. Aktualizuje čas poslední úpravy.
*   **`getCadObjectSummary(currentObjects)`**: Poskytuje souhrnné statistiky o objektech (celkový počet, podle typu geometrie, podle vrstvy, počet vybraných).

## Rizika

*   **UUID kolize**: Při opakovaném vytváření výchozích vrstev je třeba zajistit unikátnost UUID.
*   **Výkon CAD modulu**: Velký počet vrstev a objektů může ovlivnit výkon. Optimalizace vykreslování a správy dat je nezbytná.
*   **Konzistence dat**: Zajištění, že objekty jsou vždy přiřazeny platné vrstvě a že data jsou v souladu s projektovým modelem.

## Další kroky

1.  Implementovat ukládání a načítání CAD vrstev a objektů do/z databáze.
2.  Propojit CAD objekty s projektovým modelem (FVE, LPS komponenty).
3.  Rozvinout pokročilé editační nástroje pro CAD objekty.
4.  Zajistit plnou integraci s renderingovým enginem pro vizualizaci.
