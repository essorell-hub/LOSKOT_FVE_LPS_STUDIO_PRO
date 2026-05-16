# v29 DATA MODEL MASTER SPEC

## 1. Účel datového modelu

Tento dokument definuje hlavní datový model pro sjednocený program LOSKOT FVE & LPS STUDIO PRO, který zahrnuje moduly FVE, LPS/DEHN, CAD/mapa, dokumenty, databáze zařízení a exporty. Cílem je vytvořit konzistentní a ucelený datový základ pro všechny části aplikace. Viz také `docs/database/v29/v29_ENTITY_RELATION_OVERVIEW.md` pro přehled vztahů mezi entitami.

## 2. Zásada jednoho společného projektu pro FVE + LPS

Aplikace pracuje s jedním hlavním projektovým souborem, který obsahuje data pro všechny relevantní moduly (FVE, LPS, CAD, dokumenty atd.). Tato data jsou propojena a vzájemně se ovlivňují.

## 3. Kořenový objekt project

Každý projekt je reprezentován jedním kořenovým objektem `project`, který obsahuje základní informace o projektu a odkazy na ostatní hlavní sekce datového modelu.

## 4. Identifikace projektu

Každý projekt musí mít unikátní identifikátor.

- `projectId` (string, UUID): Unikátní identifikátor projektu.
- `projectName` (string): Název projektu.
- `creationDate` (datetime): Datum vytvoření projektu.
- `lastModifiedDate` (datetime): Datum poslední úpravy projektu.
- `dataModelVersion` (string): Verze datového modelu, které projekt odpovídá (např. "v29.0.0").
- `appVersion` (string): Verze aplikace, se kterou byl projekt naposledy zpracován (např. "v29.1.2").

## 5. Objekt stavby

Reprezentuje fyzickou stavbu nebo objekt, na kterém jsou realizovány FVE a/nebo LPS systémy.

- `buildingId` (string, UUID): Unikátní identifikátor stavby.
- `projectId` (string, UUID): Odkaz na kořenový objekt `project`.
- `name` (string): Název stavby (např. "Rodinný dům", "Průmyslová hala").
- `address` (object): Adresní údaje (viz bod 6).
- `type` (string): Typ stavby (např. "dům", "garáž", "hala", "stožár").
- `constructionYear` (integer): Rok výstavby.
- `description` (text): Podrobnější popis stavby.

## 6. Katastrální a adresní údaje

Detailní informace o poloze stavby.

- `street` (string): Ulice.
- `houseNumber` (string): Číslo popisné/orientační.
- `city` (string): Město.
- `postalCode` (string): PSČ.
- `municipality` (string): Obec.
- `cadastralDistrict` (string): Katastrální území.
- `cadastralParcelNumber` (string): Číslo parcely.
- `gpsCoordinates` (object): GPS souřadnice stavby.
    - `latitude` (float): Zeměpisná šířka.
    - `longitude` (float): Zeměpisná délka.
    - `altitude` (float): Nadmořská výška.

## 7. Střecha a geometrie

Definuje střechu objektu, na které mohou být umístěny FVE panely nebo LPS prvky.

- `roofId` (string, UUID): Unikátní identifikátor střechy.
- `buildingId` (string, UUID): Odkaz na objekt `building`.
- `name` (string): Název střechy (např. "Hlavní střecha", "Přístavba").
- `area` (float): Celková plocha střechy (m²).
- `material` (string): Materiál střechy (např. "taška", "plech", "eternit").
- `slope` (float): Sklon střechy (stupně).
- `orientation` (float): Orientace střechy (azimut, stupně).
- `description` (text): Popis střechy.
- `roofPlanes` (array of objects): Pole střešních rovin (viz bod 8).

## 8. Střešní roviny

Jednotlivé rovné plochy střechy, které mohou být osázeny technologií.

- `roofPlaneId` (string, UUID): Unikátní identifikátor střešní roviny.
- `roofId` (string, UUID): Odkaz na objekt `roof`.
- `name` (string): Název roviny (např. "Východní rovina", "Sedlový štít").
- `area` (float): Plocha roviny (m²).
- `slope` (float): Sklon roviny (stupně).
- `orientation` (float): Orientace roviny (azimut, stupně).
- `polygon` (object): Geometrický tvar roviny (např. pole bodů v polygonu).
- `description` (text): Popis roviny.

## 9. FVE panely

Informace o jednotlivých fotovoltaických panelech.

- `pvPanelId` (string, UUID): Unikátní identifikátor FVE panelu.
- `roofPlaneId` (string, UUID): Odkaz na `roofPlane`, na které je panel umístěn.
- `name` (string): Název panelu nebo výrobce/model.
- `manufacturer` (string): Výrobce panelu.
- `model` (string): Model panelu.
- `powerRating` (float): Jmenovitý výkon panelu (Wp).
- `efficiency` (float): Účinnost panelu (%).
- `dimensions` (object): Rozměry panelu.
    - `length` (float): Délka (mm).
    - `width` (float): Šířka (mm).
    - `area` (float): Plocha (m²).
- `placement` (object): Pozice a orientace panelu na střešní rovině.
    - `position` (object): Souřadnice středu panelu v rámci `roofPlane`.
    - `orientation` (float): Orientace panelu (azimut, stupně).
    - `slope` (float): Sklon panelu (stupně).
- `serialNumber` (string): Sériové číslo panelu (volitelné).
- `installationDate` (date): Datum instalace panelu (volitelné).

## 10. Stringy

Skupiny panelů propojené do série.

- `stringId` (string, UUID): Unikátní identifikátor stringu.
- `pvArrayId` (string, UUID): Odkaz na nadřazené pole panelů (pokud existuje) nebo přímo na projekt.
- `name` (string): Název stringu.
- `pvPanelIds` (array of strings): Pole `pvPanelId` panelů tvořících tento string.
- `numberOfPanels` (integer): Počet panelů ve stringu.
- `voltageOpenCircuit` (float): Napětí naprázdno (V).
- `voltageMPPT` (float): Napětí při maximálním výkonu (V).
- `currentShortCircuit` (float): Zkratový proud (A).
- `currentMPPT` (float): Proud při maximálním výkonu (A).
- `stringCableLength` (float): Délka kabeláže stringu (m).
- `description` (text): Popis stringu.

## 11. Střídače

Informace o měničích napětí.

- `inverterId` (string, UUID): Unikátní identifikátor střídače.
- `name` (string): Název střídače nebo výrobce/model.
- `manufacturer` (string): Výrobce.
- `model` (string): Model.
- `type` (string): Typ střídače (např. "string", "mikroinverter", "central").
- `nominalPower` (float): Jmenovitý výkon (W).
- `maxInputVoltage` (float): Maximální vstupní napětí (V).
- `maxInputCurrent` (float): Maximální vstupní proud (A).
- `outputVoltage` (float): Výstupní napětí (V).
- `outputCurrent` (float): Výstupní proud (A).
- `efficiency` (float): Účinnost (%).
- `serialNumber` (string): Sériové číslo (volitelné).
- `connectedStringIds` (array of strings): Pole `stringId` stringů připojených k tomuto střídači.

## 12. Optimalizátory

Informace o panelových optimalizátorech výkonu.

- `optimizerId` (string, UUID): Unikátní identifikátor optimalizátoru.
- `pvPanelId` (string, UUID): Odkaz na FVE panel, ke kterému je optimalizátor připojen.
- `manufacturer` (string): Výrobce.
- `model` (string): Model.
- `inputVoltage` (float): Vstupní napětí (V).
- `inputCurrent` (float): Vstupní proud (A).
- `outputVoltage` (float): Výstupní napětí (V).
- `outputCurrent` (float): Výstupní proud (A).
- `serialNumber` (string): Sériové číslo (volitelné).

## 13. DC trasy

Kabelové trasy pro stejnosměrný proud.

- `dcRouteId` (string, UUID): Unikátní identifikátor DC trasy.
- `name` (string): Název trasy.
- `cableType` (string): Typ kabelu (např. "solární kabel YPV").
- `crossSection` (float): Průřez vodiče (mm²).
- `length` (float): Délka trasy (m).
- `voltageDrop` (float): Napěťová ztráta (V).
- `connectedFromIds` (array of strings): Pole ID komponent (panelů, stringů, jiných tras), ze kterých trasa vychází.
- `connectedToIds` (array of strings): Pole ID komponent (střídačů, rozvaděčů, jiných tras), do kterých trasa vede.

## 14. AC trasy

Kabelové trasy pro střídavý proud.

- `acRouteId` (string, UUID): Unikátní identifikátor AC trasy.
- `name` (string): Název trasy.
- `cableType` (string): Typ kabelu.
- `crossSection` (float): Průřez vodiče (mm²).
- `length` (float): Délka trasy (m).
- `voltageDrop` (float): Napěťová ztráta (V).
- `connectedFromIds` (array of strings): Pole ID komponent (střídačů, rozvaděčů, jiných tras), ze kterých trasa vychází.
- `connectedToIds` (array of strings): Pole ID komponent (rozvaděčů, distribuční sítě, jiných tras), do kterých trasa vede.

## 15. Rozvaděče

Elektrické rozvaděče.

- `electricalBoardId` (string, UUID): Unikátní identifikátor rozvaděče.
- `name` (string): Název rozvaděče (např. "Hlavní FVE rozvaděč", "Ochranný rozvaděč").
- `type` (string): Typ rozvaděče (např. "FVE", "AC", "DC", "LPS").
- `location` (string): Umístění rozvaděče.
- `ratedCurrent` (float): Jmenovitý proud (A).
- `ratedVoltage` (float): Jmenovité napětí (V).
- `protectionDevices` (array of objects): Seznam ochranných prvků v rozvaděči.

## 16. SPD DC

Přepěťové ochrany pro stejnosměrnou stranu.

- `spdDcId` (string, UUID): Unikátní identifikátor SPD DC.
- `electricalBoardId` (string, UUID): Odkaz na rozvaděč, kde je SPD umístěno.
- `name` (string): Název SPD.
- `manufacturer` (string): Výrobce.
- `model` (string): Model.
- `type` (string): Typ SPD (např. "Type 1", "Type 2").
- `maxContinuousVoltage` (float): Maximální trvalé přepětí (V).
- `dischargeCurrent` (float): Impulzní výdržný proud (kA).
- `connectionPoint` (string): Bod připojení (např. "vstup FVE", "výstup na AC").

## 17. SPD AC

Přepěťové ochrany pro střídavou stranu.

- `spdAcId` (string, UUID): Unikátní identifikátor SPD AC.
- `electricalBoardId` (string, UUID): Odkaz na rozvaděč, kde je SPD umístěno.
- `name` (string): Název SPD.
- `manufacturer` (string): Výrobce.
- `model` (string): Model.
- `type` (string): Typ SPD (např. "Type 1", "Type 2").
- `maxContinuousVoltage` (float): Maximální trvalé přepětí (V).
- `dischargeCurrent` (float): Impulzní výdržný proud (kA).
- `connectionPoint` (string): Bod připojení (např. "vstup z měniče", "výstup do sítě").

## 18. LPS výpočet rizika

Výpočet rizika úderu blesku dle norem.

- `lpsRiskId` (string, UUID): Unikátní identifikátor výpočtu rizika.
- `buildingId` (string, UUID): Odkaz na stavbu, pro kterou se počítalo riziko.
- `calculationStandard` (string): Použitá norma (např. "ČSN EN 62305-2").
- `lightningProtectionLevel` (integer): Úroveň ochrany před bleskem (LPL).
- `riskLevel` (string): Výsledná úroveň rizika (např. "Nízká", "Střední", "Vysoká").
- `requiredProtectionMeasures` (text): Popis požadovaných ochranných opatření.
- `calculationDate` (date): Datum provedení výpočtu.

## 19. Třída LPS

Definice třídy ochrany před bleskem.

- `lpsClassId` (string, UUID): Unikátní identifikátor třídy LPS.
- `buildingId` (string, UUID): Odkaz na stavbu.
- `protectionClass` (integer): Třída ochrany (I, II, III, IV).
- `airTerminalType` (string): Typ jímače (např. "jímač s vyzařovačem", "stožár").
- `downconductorType` (string): Typ svodu.
- `earthingType` (string): Typ uzemnění.

## 20. Jímací soustava

Komponenty systému jímačů.

- `airTerminalSystemId` (string, UUID): Unikátní identifikátor jímací soustavy.
- `buildingId` (string, UUID): Odkaz na stavbu.
- `description` (text): Popis jímací soustavy.
- `airTerminals` (array of objects): Pole jímačů (viz bod 21).

## 21. Jímače

Jednotlivé prvky jímací soustavy.

- `airTerminalId` (string, UUID): Unikátní identifikátor jímače.
- `airTerminalSystemId` (string, UUID): Odkaz na nadřazenou jímací soustavu.
- `type` (string): Typ jímače (např. "hrot", "drát", "stožár", "vodič").
- `material` (string): Materiál (např. "měď", "nerezová ocel").
- `dimensions` (object): Rozměry jímače.
- `placement` (object): Umístění jímače na střeše nebo fasádě.
    - `type` (string): Typ umístění (např. "na hřebeni", "na hraně", "samostatně").
    - `coordinates` (object): Souřadnice jímače.

## 22. Svody

Vodiče spojující jímací soustavu s uzemněním.

- `downconductorId` (string, UUID): Unikátní identifikátor svodu.
- `buildingId` (string, UUID): Odkaz na stavbu.
- `airTerminalId` (string, UUID): Odkaz na jímač, který svod začíná.
- `earthingId` (string, UUID): Odkaz na uzemnění, kde svod končí.
- `type` (string): Typ svodu (např. "měděný pásek", "hliníkový vodič").
- `material` (string): Materiál.
- `crossSection` (float): Průřez (mm²).
- `length` (float): Délka (m).
- `distanceToStructure` (float): Vzdálenost od konstrukce (m).

## 23. HVI vodiče

Vodiče pro ochranu proti vnitřnímu přepětí.

- `hviConductorId` (string, UUID): Unikátní identifikátor HVI vodiče.
- `buildingId` (string, UUID): Odkaz na stavbu.
- `type` (string): Typ vodiče.
- `material` (string): Materiál.
- `crossSection` (float): Průřez (mm²).
- `length` (float): Délka (m).
- `connectionPoints` (array of strings): ID prvků, které spojuje.

## 24. Uzemnění

Systém uzemnění.

- `earthingId` (string, UUID): Unikátní identifikátor uzemnění.
- `buildingId` (string, UUID): Odkaz na stavbu.
- `type` (string): Typ uzemnění (např. "páskové", "tyčové", "deskové").
- `resistance` (float): Odpor uzemnění (Ohm).
- `groundElectrodeIds` (array of strings): Pole ID uzemňovacích elektrod.

## 25. LPZ zóny

Ochranné zóny proti blesku.

- `lpzZoneId` (string, UUID): Unikátní identifikátor LPZ zóny.
- `buildingId` (string, UUID): Odkaz na stavbu.
- `zoneNumber` (integer): Číslo zóny (např. 0, 1, 2, 3).
- `description` (text): Popis zóny a jejích charakteristik.
- `boundaryElements` (array of strings): Popis ochranných prvků na hranici zóny.

## 26. CAD/mapové vrstvy

Objekty pro vizualizaci v CAD/mapovém prostředí.

- `cadLayerId` (string, UUID): Unikátní identifikátor vrstvy.
- `projectId` (string, UUID): Odkaz na projekt.
- `name` (string): Název vrstvy (např. "FVE panely", "LPS jímací soustava").
- `type` (string): Typ vrstvy (např. "linie", "plocha", "bod").
- `color` (string): Barva vrstvy.
- `visibility` (boolean): Viditelnost vrstvy.
- `objects` (array of objects): Pole CAD objektů v dané vrstvě.

## 27. Dokumenty

Správa souvisejících dokumentů.

- `documentId` (string, UUID): Unikátní identifikátor dokumentu.
- `projectId` (string, UUID): Odkaz na projekt.
- `name` (string): Název dokumentu.
- `type` (string): Typ dokumentu (např. "PDF", "DWG", "DOCX", "JPG").
- `filePath` (string): Cesta k souboru dokumentu.
- `uploadDate` (datetime): Datum nahrání.
- `description` (text): Popis dokumentu.

## 28. Exporty

Nastavení a výsledky exportů dat.

- `exportId` (string, UUID): Unikátní identifikátor exportu.
- `projectId` (string, UUID): Odkaz na projekt.
- `type` (string): Typ exportu (např. "JSON", "CSV", "PDF report").
- `exportDate` (datetime): Datum exportu.
- `filePath` (string): Cesta k exportovanému souboru.
- `settings` (object): Nastavení použité při exportu.

## 29. QA kontroly

Záznamy o výsledcích kontrol kvality.

- `qaCheckId` (string, UUID): Unikátní identifikátor kontroly.
- `projectId` (string, UUID): Odkaz na projekt.
- `checkDate` (datetime): Datum kontroly.
- `checkedBy` (string): Kdo provedl kontrolu.
- `entityId` (string): ID kontrolovaného objektu/entity.
- `entityType` (string): Typ kontrolovaného objektu/entity.
- `fieldName` (string): Název pole, které bylo kontrolováno (pokud relevantní).
- `status` (string): Stav kontroly (např. "OK", "WARNING", "ERROR").
- `message` (text): Zpráva o výsledku kontroly.

## 30. Auditní stopa

Záznamy o změnách v datech.

- `auditLogId` (string, UUID): Unikátní identifikátor záznamu.
- `projectId` (string, UUID): Odkaz na projekt.
- `timestamp` (datetime): Čas změny.
- `userId` (string): ID uživatele, který změnu provedl.
- `action` (string): Typ akce (např. "CREATE", "UPDATE", "DELETE").
- `entityId` (string): ID změněné entity.
- `entityType` (string): Typ změněné entity.
- `field` (string): Název změněného pole.
- `oldValue` (any): Stará hodnota pole.
- `newValue` (any): Nová hodnota pole.

## 31. Uživatelské nastavení

Globální nebo projektově specifická uživatelská nastavení.

- `settingId` (string, UUID): Unikátní identifikátor nastavení.
- `projectId` (string, UUID): Odkaz na projekt (pokud je nastavení projektově specifické, jinak null).
- `userId` (string): ID uživatele, ke kterému nastavení patří.
- `key` (string): Klíč nastavení (např. "defaultUnit", "colorTheme").
- `value` (any): Hodnota nastavení.

## 32. Verze datového modelu

Pole `dataModelVersion` v kořenovém objektu `project` indikuje, které verzi schématu datový model odpovídá. Toto je klíčové pro zajištění zpětné kompatibility a pro řízení migračních procesů.

## 33. JSON fallback

V případě technických problémů s databázovou perzistencí nebo při přenosu dat může být datový model dočasně nebo trvale reprezentován jako JSON soubor. Tento JSON musí striktně odpovídat definici v `v29_DATA_MODEL_MASTER_SPEC.md`.

## 34. SQLite persistence

Primárním cílem pro ukládání dat je SQLite databáze. Datový model musí být navržen s ohledem na efektivní mapování do relační struktury SQLite.

## 35. Import/export pravidel

- Import: JSON soubor musí odpovídat aktuální nebo zpětně kompatibilní verzi datového modelu. Aplikace musí zvládnout import starších verzí pomocí migračních skriptů.
- Export: Data z projektu musí být možné exportovat do standardizovaných formátů (JSON, CSV, případně specifické reporty).

## 36. Co je povinné a co volitelné

Pole označená jako povinná (`required: true` v detailní specifikaci) musí být vždy vyplněna. Ostatní pole jsou volitelná a jejich absence by neměla způsobit chybu aplikace.
Povinné jsou minimálně identifikační pole a klíčová data pro základní funkčnost (např. `projectId`, `projectName`, základní údaje o stavbě).

## 37. Doporučený minimální projekt

Minimální projekt obsahuje:
- Kořenový objekt `project` s `projectId` a `projectName`.
- Jeden objekt `building` s `buildingId` a základními adresními údaji.

## 38. Doporučený plný projekt

Plný projekt obsahuje všechny definované sekce datového modelu vyplněné relevantními daty.

## 39. Rizika nekonzistence dat

- Duplicitní záznamy.
- Chybějící vazby mezi entitami.
- Neplatná data (např. nesprávné formáty čísel, dat).
- Rozpor mezi datovým modelem a UI.
- Ztráta dat při migraci.

## 40. Doporučení pro v30

- Implementace plné podpory pro React/Tauri.
- Rozšíření modulu dokumentů o správu verzí a šablon.
- Zavedení pokročilých výpočtů pro FVE a LPS.
- Integrace s externími databázemi (např. katastr nemovitostí).
