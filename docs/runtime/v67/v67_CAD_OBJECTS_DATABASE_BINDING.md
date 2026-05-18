# V67 – CAD OBJECTS DATABASE BINDING

## Účel

Napojení CAD objektů, vrstev a symbolů na databázový/project model.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/cadObjectsDatabaseBinding.js`
- `tests/runtime/v67_cad_objects_database_binding_smoke_test.js`
- `scripts/verify/verify_v67_cad_objects_database_binding.sh`
- `docs/runtime/v67/v67_CAD_OBJECTS_DATABASE_BINDING.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
