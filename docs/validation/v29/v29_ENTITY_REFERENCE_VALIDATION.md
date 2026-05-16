# Kontrola referencí v datovém modelu LOSKOT FVE & LPS STUDIO PRO (v29)

## Účel kontroly referencí

Tato kontrola zajišťuje integritu datového modelu tím, že ověřuje, zda všechny odkazy (reference) mezi entitami směřují na existující a platné záznamy. Zabraňuje vzniku "osiřelých" entit a zajišťuje konzistenci dat.

## Typy referencí a jejich validace

### Základní projektové entity
- **`projectId`**: Reference na hlavní projekt. Musí existovat v seznamu projektů.
- **`buildingId`**: Reference na konkrétní budovu v rámci projektu. Musí existovat v rámci daného `projectId`.
- **`roofId`**: Reference na střechu budovy. Musí existovat v rámci daného `buildingId`.
- **`roofPlaneId`**: Reference na rovinu střechy. Musí existovat v rámci daného `roofId`.

### FVE komponenty
- **`panelId`**: Reference na fotovoltaický panel. Musí existovat v seznamu panelů.
- **`stringId`**: Reference na string (řetězec) panelů. Musí existovat v rámci FVE konfigurace a odkazovat na platné `panelId`.
- **`inverterId`**: Reference na střídač. Musí existovat v seznamu střídačů.
- **`dcRouteId`**: Reference na DC trasu. Musí odkazovat na platné `inverterId` a/nebo `stringId`.

### LPS komponenty
- **`airTerminalId`**: Reference na jímací prvek (air terminal).
- **`downConductorId`**: Reference na svod.
- **`hviId`**: Reference na vysokonapěťový izolátor (High Voltage Insulator).
- **`lpzId`**: Reference na zónu ochrany proti přepětí (Lightning Protection Zone).
- **`spdId`**: Reference na přepěťovou ochranu (Surge Protection Device).

### Ostatní
- **`cad layerRef`**: Reference na CAD vrstvu. Musí existovat v CAD datech.
- **`cad objectRef`**: Reference na CAD objekt. Musí existovat v rámci CAD dat a vrstvy.
- **`document fileRef`**: Reference na dokument. Musí odkazovat na existující soubor v systému.
- **`QA relatedEntityRef`**: Reference na entitu, ke které se vztahuje QA výsledek.

## Řešení chybových stavů

### Chybějící reference
Pokud reference směřuje na neexistující entitu, je třeba:
1. Identifikovat zdrojovou entitu s chybnou referencí.
2. Identifikovat cílovou entitu, která chybí.
3. Vytvořit chybějící cílovou entitu nebo opravit zdrojovou referenci.

### Osiřelá entita
Entita je osiřelá, pokud na ni neukazuje žádná jiná entita (kromě případných nadřazených entit jako projekt nebo budova), ale přesto je v systému přítomna. Je třeba:
1. Zkontrolovat, zda entita není nezbytná.
2. Pokud není nezbytná, odstranit ji.
3. Pokud je nezbytná, vytvořit chybějící vazby.

### Cyklická reference
Pokud entita A odkazuje na B, B na C a C zpět na A (nebo složitější cykly), může to způsobit problémy při zpracování dat. Je třeba:
1. Identifikovat cyklus.
2. Přehodnotit návrh datového modelu nebo datovou strukturu.
3. Odstranit cyklus úpravou jedné z referencí tak, aby se cyklus přerušil, pokud je to logicky možné.

## Checklist pro validaci referencí

- [ ] Ověřeny všechny `projectId` reference.
- [ ] Ověřeny všechny `buildingId` reference.
- [ ] Ověřeny všechny `roofId` reference.
- [ ] Ověřeny všechny `roofPlaneId` reference.
- [ ] Ověřeny všechny `panelId` reference.
- [ ] Ověřeny všechny `stringId` reference.
- [ ] Ověřeny všechny `inverterId` reference.
- [ ] Ověřeny všechny `dcRouteId` reference.
- [ ] Ověřeny všechny `airTerminalId` reference.
- [ ] Ověřeny všechny `downConductorId` reference.
- [ ] Ověřeny všechny `hviId` reference.
- [ ] Ověřeny všechny `lpzId` reference.
- [ ] Ověřeny všechny `spdId` reference.
- [ ] Ověřeny všechny `cad layerRef`.
- [ ] Ověřeny všechny `cad objectRef`.
- [ ] Ověřeny všechny `document fileRef`.
- [ ] Ověřeny všechny `QA relatedEntityRef`.
- [ ] Zkontrolována přítomnost všech "osiřelých" entit.
- [ ] Zkontrolována přítomnost všech cyklických referencí.
