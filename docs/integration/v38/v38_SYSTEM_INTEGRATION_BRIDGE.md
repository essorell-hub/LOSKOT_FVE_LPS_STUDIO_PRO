# v38 SYSTEM INTEGRATION BRIDGE

## Účel

Verze v38 doplňuje do preview samostatnou obrazovku systémové integrace.

## Co propojuje

- projekt / zakázku
- FVE panely a stringy
- CAD vrstvy
- LPS / DEHN objekty
- dokumenty
- databázové preview úložiště
- exportní položky
- QA upozornění

## Co je reálně funkční

- zobrazení integrační mapy
- souhrn projektu
- souhrn FVE
- souhrn CAD
- souhrn LPS
- souhrn dokumentů
- souhrn databáze
- souhrn exportu
- QA upozornění
- bezpečný fallback při chybě

## Co je stále preview

- HTML stále používá část vlastní fallback logiky
- UI zatím nenačítá přímo ES moduly ze `src/`
- SQLite není produkčně připojené
- DOCX/PDF generování není produkčně hotové
- LPS risk assessment je placeholder

## Další krok

v39 má začít připravovat runtime bridge mezi preview UI a zdrojovými moduly v `src/`.
