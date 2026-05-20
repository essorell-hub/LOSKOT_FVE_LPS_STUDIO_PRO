# IMPLEMENTATION_PACK_01_UI_FOUNDATION.md

## Cíl
Připravit první bezpečný převod schváleného UI do skutečné aplikace.

## Rozsah
- hlavní Classic PRO layout,
- levé menu,
- horní lišta,
- pravý QA panel,
- centrální pracovní plocha,
- přepínání hlavních obrazovek,
- jednotný demo model zakázky,
- fallback pro každý modul,
- ochrana proti bílé obrazovce.

## Mimo rozsah tohoto prvního runneru
- hluboké výpočty FVE,
- finální normové LPS výpočty,
- změna vzhledu,
- změna package.json,
- push/merge.

## Kontroly
- backup UI složek,
- git status,
- node --check pro JS soubory,
- npm run verify, pokud je dostupné node_modules,
- strict scan reportu,
- git diff --check,
- report do _loskot_reports.
