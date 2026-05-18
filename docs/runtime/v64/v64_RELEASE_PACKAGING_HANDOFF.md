# V64 – RELEASE PACKAGING HANDOFF

## Účel

Release checklist, release manifest, Windows handoff plán a release readiness.

## Přidané soubory

- `src/runtime/releasePackagingHandoff.js`
- `tests/runtime/v64_release_packaging_handoff_smoke_test.js`
- `scripts/verify/verify_v64_release_packaging_handoff.sh`
- `docs/runtime/v64/v64_RELEASE_PACKAGING_HANDOFF.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Vrací structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.
