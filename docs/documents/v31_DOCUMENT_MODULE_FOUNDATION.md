# DOCUMENT MODULE FOUNDATION (v31)

## Projekt: LOSKOT FVE & LPS STUDIO PRO

## Verze: v31 - Integrace databáze a pokročilých modulů

## Datum: 2026-05-16

## Cíl dokumentu

Tento dokument popisuje základní strukturu a principy pro správu dokumentů v rámci projektu LOSKOT FVE & LPS STUDIO PRO. Cílem je vytvořit modulární a snadno rozšiřitelný systém pro evidenci a správu všech dokumentů souvisejících s projektem.

## Základní principy

*   **Centralizovaná evidence**: Všechny dokumenty relevantní k projektu budou evidovány v centrálním úložišti.
*   **Metadata**: Ke každému dokumentu budou uložena klíčová metadata (typ, název, verze, popis, cesta k souboru, přiřazení k projektu/objektu).
*   **Integrace s projektovým modelem**: Dokumenty budou logicky propojeny s konkrétními částmi projektu (např. FVE komponenty, LPS návrh, objekt, zakázka).
*   **Verzování**: Podpora pro správu různých verzí dokumentů.

## Datový model (návrh)

Pro evidenci dokumentů bude použita tabulka `documents` v databázi.

### Tabulka `documents`

*   `id`: Unikátní identifikátor dokumentu.
*   `projectId`: ID projektu, ke kterému dokument náleží.
*   `relatedEntityType`: Typ entity, ke které je dokument přiřazen (např. "project", "object", "fvePanel", "lpsComponent").
*   `relatedEntityId`: ID konkrétní entity, ke které je dokument přiřazen.
*   `type`: Typ dokumentu (např. "Technická zpráva FVE", "Protokol o měření LPS", "Revizní zpráva", "Datový list komponenty", "Výkres CAD"). Definováno pomocí `DOCUMENT_TYPES` konstan.
*   `name`: Název dokumentu.
*   `description`: Volitelný popis dokumentu.
*   `version`: Verze dokumentu.
*   `filePath`: Cesta k fyzickému souboru dokumentu (v lokálním úložišti nebo v cloudovém úložišti).
*   `createdAt`, `updatedAt`: Časové značky.

## Funkcionalita modulu

*   **Vytvoření/Registrace dokumentu**: Funkce pro přidání nového dokumentu do evidence včetně zadání metadat.
*   **Načtení dokumentů**: Načtení seznamu dokumentů pro konkrétní projekt nebo entitu.
*   **Aktualizace metadat**: Možnost editovat metadata existujícího dokumentu.
*   **Správa verzí**: Funkce pro nahrání nové verze dokumentu a archivaci starších.
*   **Propojení s UI**: Zobrazení seznamu dokumentů v rámci projektového rozhraní.

## Rizika

*   **Správa souborů**: Efektivní správa velkého množství fyzických souborů (úložiště, zálohování, přístupová práva).
*   **Konvence pojmenování**: Nutnost dodržovat jednotné konvence pro názvy souborů a jejich strukturu.
*   **Integrace s externími systémy**: Možnost budoucí integrace s DMS (Document Management Systems) nebo cloudovými úložišti (Dropbox, Google Drive).
*   **Bezpečnost**: Zajištění zabezpečení citlivých dokumentů.

## Další kroky

1.  Implementovat databázovou tabulku `documents` a odpovídající repozitář.
2.  Vytvořit základní funkce pro CRUD operace s metadaty dokumentů.
3.  Definovat standardní typy dokumentů pomocí konstant (`DOCUMENT_TYPES`).
4.  Navrhnout UI pro zobrazení a správu dokumentů v rámci projektu.
5.  Implementovat logiku pro propojování dokumentů s projektovými entitami.
