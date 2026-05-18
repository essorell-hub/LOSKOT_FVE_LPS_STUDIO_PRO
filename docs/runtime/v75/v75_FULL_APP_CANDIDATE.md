# V75 – FULL APP CANDIDATE

## Účel

První FULL APP Candidate: stabilizovaný integrační kandidát před další PRO stabilizací.

## Role ve FULL APP integraci

Tato verze je součástí integrační vrstvy V65–V75. Cílem je spojovat již připravené moduly V49–V64 do jedné aplikace, aniž by se přepisoval Classic PRO vzhled nebo vznikla bílá obrazovka.

## Přidané soubory

- `src/runtime/fullAppCandidateRuntime.js`
- `tests/runtime/v75_full_app_candidate_smoke_test.js`
- `scripts/verify/verify_v75_full_app_candidate.sh`
- `docs/runtime/v75/v75_FULL_APP_CANDIDATE.md`

## Bezpečnostní zásady

- Neměnit `package.json`.
- Neměnit `package-lock.json`.
- Neměnit preview HTML.
- Zachovat Classic PRO vzhled.
- Chyba modulu nesmí shodit celou aplikaci.
- Každý výstup má structured runtime result.
