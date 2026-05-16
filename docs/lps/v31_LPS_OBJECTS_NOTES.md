# LPS - Poznámky k objektům (v31)

## Projekt: LOSKOT FVE & LPS STUDIO PRO

## Verze: v31 - Integrace databáze a pokročilých modulů

## Datum: 2026-05-16

## Cíl dokumentu

Tento dokument popisuje základní definice a principy pro vytváření a správu LPS (Ochrana před bleskem) objektů v rámci projektu LOSKOT FVE & LPS STUDIO PRO. Cílem je zajistit jednotný a robustní způsob reprezentace komponent LPS.

## LPS Objekty

LPS objekty představují jednotlivé komponenty systému ochrany před bleskem, jako jsou jímací tyče, svody, pospojovací vodiče, uzemňovací elektrody, svodiče přepětí atd.

### Základní struktura LPS objektu

Každý LPS objekt je definován pomocí následujících klíčových vlastností:

*   **`id`**: Unikátní identifikátor objektu (vygenerovaný nebo přiřazený).
*   **`type`**: Typ LPS komponenty (např. "Jímací tyč", "Svodič", "Uzemňovací pásek", "SPD", "LPZ Zóna").
*   **`name`**: Uživatelsky přívětivý název objektu.
*   **`geometryType`**: Typ geometrie objektu v CAD (např. "point", "line", "polygon").
*   **`geometry`**: Konkrétní geometrická data pro vykreslení (souřadnice, tvary).
*   **`layerId`**: ID vrstvy v CAD, ke které je objekt přiřazen.
*   **`properties`**: Objekt obsahující specifické vlastnosti daného typu LPS komponenty (např. materiál, průřez, délka, norma, ochrané parametry).
*   **`createdAt`, `updatedAt`**: Časové značky vytvoření a poslední aktualizace objektu.

### Funkce pro práci s LPS objekty

*   **`createBaseLpsObject({...})`**: Interní pomocná funkce pro vytvoření základní struktury LPS objektu s vynucením povinných parametrů jako `type`, `name`, `geometryType`, `geometry`.
*   **`normalizeLpsObject(lpsObject, updateTimestamp)`**: Zajišťuje standardizovaný formát LPS objektu, přidává chybějící `id`, `type`, `name` a časové značky.

## Podporované typy geometrie

Podobně jako u CAD objektů, i LPS objekty využívají standardní typy geometrie, které jsou podporovány CAD modulem.

## Vztah k ostatním modulům

*   **CAD modul**: LPS objekty mají definovanou geometrii a přiřazení k vrstvám pro vizualizaci v CAD.
*   **Projektový model**: LPS objekty jsou součástí celkového projektového modelu a budou ukládány do databáze.
*   **Výpočty a normy**: Vlastnosti LPS objektů (např. délka svodu, typ jímací tyče) budou využity pro normové výpočty a ověření návrhu.

## Rizika

*   **Neúplná typologie**: Rozšíření seznamu podporovaných typů LPS komponent dle norem a požadavků uživatelů.
*   **Složitost vlastností**: Některé LPS komponenty mohou mít velmi specifické a komplexní vlastnosti, které bude nutné správně modelovat.
*   **Validace vlastností**: Zajištění, že zadané vlastnosti odpovídají platným normám a technickým možnostem.

## Další kroky

1.  Rozšířit definici `type` pro pokrytí všech relevantních LPS komponent dle norem (např. ČSN EN 62305).
2.  Implementovat detailní definice `properties` pro jednotlivé typy LPS objektů.
3.  Propojit LPS objekty s funkcemi pro normové výpočty.
4.  Zajistit ukládání a načítání LPS objektů do/z databáze.
