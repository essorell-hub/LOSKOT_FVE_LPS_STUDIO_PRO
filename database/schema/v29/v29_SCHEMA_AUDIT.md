# Audit JSON schémat pro LOSKOT FVE & LPS STUDIO PRO v29

Tento dokument shrnuje audit hlavních JSON schémat použitých v projektu LOSKOT FVE & LPS STUDIO PRO verze v29. Cílem auditu je zhodnotit účel, strukturu, vazby, potenciální nedostatky a navrhnout doporučení pro další vývoj.

## 1. Účel schémat

JSON schémata definují strukturu a validaci dat pro jednotlivé moduly a celkový datový model projektu. Zajišťují konzistenci, předvídatelnost a umožňují efektivní zpracování dat v aplikaci.

## 2. Auditoaná schémata a jejich hlavní entity

*   **`shared-definitions.schema.json`**:
    *   **Účel**: Poskytuje základní, sdílené datové typy (ID, časová razítka, souřadnice, adresy, statusy, závažnosti atd.).
    *   **Hlavní entity**: `id`, `timestamp`, `point2d`, `point3d`, `address`, `qaStatus`, `fileReference`, `note`.
    *   **Vazby**: Všechna ostatní schémata na něj odkazují prostřednictvím `$ref`.

*   **`project.schema.json`**:
    *   **Účel**: Hlavní schéma, které agreguje všechny moduly projektu.
    *   **Hlavní entity**: `projectId`, `projectInfo`, `building`, `roofs`, `fve`, `lps`, `cad`, `documents`, `exports`, `qa`, `migrationHistory`.
    *   **Vazby**: Odkazuje na schémata modulů (`fve`, `lps`, `cad`, `documents`, `exports`, `qa`) a `building`, `roof`. Používá definice ze `shared-definitions.schema.json`.

*   **`building.schema.json`**:
    *   **Účel**: Detailní popis jedné budovy.
    *   **Hlavní entity**: `buildingId`, `name`, `address`, `cadastral`, `owner`, `investor`, `geometrySummary`, `usageType`.
    *   **Vazby**: Používá `address` a `cadastralInfo` ze `shared-definitions.schema.json`.

*   **`roof.schema.json`**:
    *   **Účel**: Popis geometrie a vlastností střechy.
    *   **Hlavní entity**: `roofId`, `buildingId`, `roofType`, `planes` (s `polygon`, `slope`, `orientation`), `ridgeLines`, `eaves`, `valleys`, `obstacles`, `safetyZones`.
    *   **Vazby**: Používá `uuid`, `polygon2d`, `point3d`, `layerRef` ze `shared-definitions.schema.json`.

*   **`fve.schema.json`**:
    *   **Účel**: Detailní konfigurace fotovoltaické elektrárny.
    *   **Hlavní entity**: `panels`, `strings`, `inverters`, `optimizers`, `dcRoutes`, `acRoutes`, `spdDc`, `spdAc`, `calculations`.
    *   **Vazby**: Odkazuje na `shared-definitions.schema.json` (`id`, `dimensions`, `point2d`, `note`, `fileReference`, `auditEntry`) a nepřímo na `roof.schema.json` přes `roofPlaneId`.

*   **`lps.schema.json`**:
    *   **Účel**: Detailní konfigurace systému ochrany před bleskem.
    *   **Hlavní entity**: `riskAssessment`, `lpsClass`, `airTermination` (`airTerminals`), `mesh`, `downConductors`, `hvi`, `earthing`, `spd`, `lpz`, `normativeChecks`.
    *   **Vazby**: Odkazuje na `shared-definitions.schema.json` (`id`, `status`, `note`, `point3d`, `entityRef`, `severity`) a `cad.schema.json` přes `cadObjectRef`.

*   **`cad.schema.json`**:
    *   **Účel**: Správa geometrických objektů a vrstev v CAD modulu.
    *   **Hlavní entity**: `layers`, `objects` (s `geometryType`, `points`), `view`, `scale`, `grid`, `snap`.
    *   **Vazby**: Používá `id`, `point2d`, `entityRef`, `note` ze `shared-definitions.schema.json`.

*   **`documents.schema.json`**:
    *   **Účel**: Správa dokumentace, šablon a technických listů.
    *   **Hlavní entity**: `documentTemplates`, `generatedDocuments`, `datasheets`, `attachments`, `approvals`.
    *   **Vazby**: Odkazuje na `shared-definitions.schema.json` (`id`, `fileReference`, `entityRef`, `note`, `status`, `severity`, `timestamp`).

*   **`exports.schema.json`**:
    *   **Účel**: Konfigurace a historie exportů projektu.
    *   **Hlavní entity**: `exportProfiles`, `exportHistory`, `packages`, `printSettings`.
    *   **Vazby**: Odkazuje na `shared-definitions.schema.json` (`id`, `fileReference`, `status`, `timestamp`, `severity`).

*   **`qa.schema.json`**:
    *   **Účel**: Záznam výsledků a stavu QA kontrol.
    *   **Hlavní entity**: `checks` (s `category`, `severity`, `status`), `score`, `status`, `errors`, `warnings`, `lastRunAt`.
    *   **Vazby**: Odkazuje na `shared-definitions.schema.json` (`id`, `timestamp`, `status`, `severity`, `entityRef`, `auditEntry`).

## 3. Vazby mezi schématy

Schémata jsou silně propojena pomocí `$ref`, především skrze `shared-definitions.schema.json`. Hlavní schéma `project.schema.json` slouží jako kořenový kontejner, který odkazuje na jednotlivé moduly (`fve`, `lps`, `cad`, `documents`, `exports`, `qa`), budovu (`building`) a střechy (`roof`). Moduly pak odkazují zpět na sdílené definice nebo na jiné relevantní moduly (např. FVE na střechy).

## 4. Chybějící nebo rizikové oblasti

*   **Konzistence ID**: Použití `id` (obecný string) a `uuid` (formát uuid) pro identifikátory může být matoucí. Doporučuje se sjednotit na `uuid` všude, kde je potřeba globální unikátnost.
*   **`lps.schema.json`**:
    *   Části jako `airTermination`, `mesh`, `downConductors`, `hvi`, `earthing`, `spd`, `lpz` jsou definovány jako objekty, nikoli jako pole. To omezuje možnost mít více instancí těchto prvků (např. více typů uzemnění nebo více SPD v jedné zóně). Mělo by být přetvořeno na pole.
    *   Chybí přímé propojení mezi SPD a LPS třídou nebo mezi SPD a LPZ zónami.
*   **`fve.schema.json`**:
    *   Pole `panelIds` ve `string` by mělo být typově bezpečnější, např. jako reference na objekty panelů.
    *   Chybí explicitní definice parametrů pro `calculations` (např. jaké modely/parametry byly použity pro výpočet `annualYieldKwh`).
*   **`cad.schema.json`**:
    *   `entityRef` v `cad.schema.json > object` by měl být specifičtější a odkazovat na typy entit definované v jiných schématech (např. `buildingId`, `roofId`, `panelId`).
*   **Všechna schémata**: Absence jednotného způsobu pro ukládání metadat o původu dat (např. které hodnoty pocházejí z importu, které z manuálního zadání, které z výpočtu).
*   **`exports.schema.json`**: Pole `includedSections` v `exportProfile` je jen seznam stringů, což může vést k překlepům. Lepší by bylo použít enum nebo referenci na definované sekce.

## 5. Doporučené opravy před implementací

*   Sjednotit typy ID na `uuid` tam, kde je to relevantní.
*   Upravit `lps.schema.json` pro pole u `airTerminals`, `downConductors`, `earthing`, `spd`, `lpz` a zvážit propojení mezi SPD a LPZ.
*   Zpřesnit `entityRef` v `cad.schema.json` pro lepší typovou bezpečnost.
*   Zvážit přidání pole pro metadata o původu dat do `shared-definitions.schema.json`.
*   Přidat více detailů do `calculations` v `fve.schema.json`.

## 6. Co nechat až do v30

*   Plná implementace všech typů objektů v CAD.
*   Pokročilé výpočty a simulace v FVE/LPS modulech.
*   Integrace s externími databázemi nebo API.
*   Detailnější auditní záznamy pro každou změnu hodnoty.

## 7. Checklist validace

*   [ ] Zkontrolovat všechna `$ref` pro správnost cest a existence definic.
*   [ ] Ověřit striktní dodržování datových typů a formátů (např. `date-time`, `uuid`, `email`).
*   [ ] Projít všechny `required` pole a ujistit se, že pokrývají všechny nezbytné atributy.
*   [ ] Zkontrolovat `enum` hodnoty pro konzistenci a úplnost.
*   [ ] Validovat vazby mezi entitami (např. zda odkazované `entityId` skutečně existují v kontextu projektu).
*   [ ] Zkontrolovat srozumitelnost popisů (`description`) pro všechny klíčové vlastnosti.

Tento audit poskytuje základní přehled. Hlubší validace a revize jednotlivých schémat by měla proběhnout před jejich plnou integrací do aplikační logiky.

v29 schema audit
````
````json
docs/audit/v29/v29_SCHEMA_AUDIT.md
<<<<<<< SEARCH
````
