# v29 DATA MODEL QA CHECKLIST

Tento checklist slouží k zajištění kvality a konzistence datového modelu.

## 1. Kontrola kořenového objektu

- [ ] Projekt obsahuje kořenový objekt `project`.
- [ ] Projekt má unikátní `projectId` (UUID).
- [ ] Projekt má `projectName`.
- [ ] Projekt má definované `dataModelVersion` (např. "v29.0.0").
- [ ] Projekt má definované `appVersion` (např. "v29.1.2").

## 2. Kontrola povinných polí

- [ ] Všechna definovaná povinná pole v každé sekci jsou přítomna a vyplněna.
- [ ] Pole označená jako volitelná mohou být prázdná nebo chybět.

## 3. Kontrola ID

- [ ] Všechna ID polí (UUID) jsou unikátní v rámci svého typu.
- [ ] ID jsou ve správném formátu (např. UUID).
- [ ] Pole `projectId` v podřízených entitách odpovídá `projectId` kořenového objektu.

## 4. Kontrola vazeb

- [ ] Všechny definované vazby mezi entitami jsou správné (např. `buildingId` v `roof` odkazuje na existující `buildingId`).
- [ ] Neexistují "osiřelá" data (např. `roof` bez odpovídajícího `building`).
- [ ] Pole s více ID (např. `connectedStringIds`) obsahují pouze platná ID.

## 5. Kontrola FVE dat

- [ ] Panely (`pvPanel`) mají platné rozměry, výkon a umístění.
- [ ] Stringy (`string`) mají správný počet panelů a odpovídající elektrické parametry.
- [ ] Střídače (`inverter`) mají definovaný výkon a připojené stringy.
- [ ] DC/AC trasy mají definované parametry a správná připojení.

## 6. Kontrola LPS dat

- [ ] Výpočet rizika (`lpsRisk`) je v souladu s normou a má definovanou úroveň ochrany.
- [ ] Jímače (`airTerminal`) mají definované umístění a typ.
- [ ] Svody (`downconductor`) mají definované parametry a propojení mezi jímači a uzemněním.
- [ ] Uzemnění (`earthing`) má definovaný odpor a typ.

## 7. Kontrola CAD dat

- [ ] CAD vrstvy (`cadLayer`) mají definovaný název, typ a barvu.
- [ ] Objekty v CAD vrstvách mají platnou geometrii a přiřazení k vrstvě.

## 8. Kontrola dokumentů

- [ ] Dokumenty (`document`) mají platný název, typ a cestu k souboru.
- [ ] Cesta k souboru dokumentu je platná nebo soubor existuje.

## 9. Kontrola exportů

- [ ] Exporty (`export`) mají definovaný typ, datum a cestu k souboru.
- [ ] Nastavení exportu jsou validní.

## 10. Kontrola QA semaforu

- [ ] Všechny záznamy `qaCheck` mají platný odkaz na kontrolovanou entitu (`entityId`, `entityType`).
- [ ] Stav kontroly (`status`) je validní ("OK", "WARNING", "ERROR").

## 11. Kontrola verzování

- [ ] Pole `dataModelVersion` je konzistentní napříč projektem a odpovídá definici.
- [ ] Pokud jsou přítomny migrační záznamy, jsou správně formátované a verzované.

## 12. Kontrola importu

- [ ] Projekt lze úspěšně naimportovat ze vzorového JSON souboru.
- [ ] Všechny povinné sekce a pole jsou v importovaném JSONu přítomny.

## 13. Kontrola exportu

- [ ] Projekt lze úspěšně exportovat do JSON formátu.
- [ ] Exportovaný JSON odpovídá původním datům a aktuálnímu datovému modelu.

## 14. Kontrola chybějících polí

- [ ] Aplikace správně zpracuje projekt s chybějícími volitelnými poli.
- [ ] Při chybějících povinných polích se zobrazí adekvátní varování/chyba.

## 15. Kontrola neznámých polí

- [ ] Aplikace ignoruje neznámá pole v JSONu projektu, která nejsou definována v aktuálním datovém modelu.

## 16. Tabulka test / očekávaný výsledek / stav

| Test                                    | Očekávaný výsledek                        | Stav      | Poznámka                                  |
|-----------------------------------------|-------------------------------------------|-----------|-------------------------------------------|
| Kontrola `projectId` v `building`       | `building.projectId` == `project.projectId` | `[ ]`     |                                           |
| Kontrola existence `roofPlane.roofId`   | `roofPlane.roofId` existuje v `roof`       | `[ ]`     |                                           |
| Validace `pvPanel.powerRating`          | > 0                                       | `[ ]`     |                                           |
| Kontrola unikátnosti `stringId`         | Každý `stringId` je unikátní              | `[ ]`     |                                           |
| Kontrola vazby `spdDc.electricalBoardId`| `electricalBoardId` existuje v `electricalBoard`| `[ ]`     |                                           |
| Kontrola `dataModelVersion` formátu     | "vX.Y.Z"                                  | `[ ]`     |                                           |
| Import `sample-project.json`            | Bez chyb, data načtena                     | `[ ]`     |                                           |
| Export projektu do JSON                 | JSON je validní a kompletní               | `[ ]`     |                                           |
