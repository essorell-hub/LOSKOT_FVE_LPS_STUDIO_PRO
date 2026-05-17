# v48 FVE CAD App Connector Foundation

v48 navazuje na v47 FVE CAD DOM Binding a přidává bezpečnou aplikační mezivrstvu, která umí najít vhodný CAD mount target, případně vytvořit bezpečný fallback container a napojit do něj v47 DOM binding.

## Cíl v48

- najít existující CAD container bez ručního programování,
- použít bezpečné selectory pro budoucí CAD obrazovku,
- vytvořit fallback container pouze tehdy, když je to výslovně povoleno,
- předat container do v47 DOM bindingu,
- připravit app-level API pro mount / refresh / unmount,
- doplnit scan skutečných lokálních UI entrypointů,
- zachovat Classic PRO vzhled,
- neměnit preview HTML,
- neměnit `package.json` ani `package-lock.json`,
- zabránit bílé obrazovce přes strukturované runtime chyby.

## Přidané runtime API

Soubor:

`src/runtime/fveCadAppConnector.js`

Exporty:

- `FVE_CAD_APP_CONNECTOR_VERSION`
- `createFveCadAppConnector(options)`
- `safeFveCadAppConnector(options)`

Hlavní funkce:

- `getCandidateSelectors()`
- `detectCadContainers(payload)`
- `createFallbackContainer(payload)`
- `resolveMountTarget(payload)`
- `getIntegrationPlan()`
- `getStatus(payload)`
- `mount(payload)`
- `install(payload)`
- `refresh(payload)`
- `dispatchAppEvent(eventName, payload)`
- `unmount(payload)`
- `run(command, payload)`

## Bezpečné selectory

v48 hledá CAD mount target například podle:

- `[data-loskot-fve-cad-root]`
- `[data-loskot-cad-preview]`
- `[data-cad-preview]`
- `#loskot-cad-preview`
- `#cad-preview`
- `.loskot-cad-preview`
- `.cad-preview`

## Scan entrypointů

Soubor:

`scripts/verify/v48_scan_app_entrypoints.mjs`

Tento scan je informativní. Vypíše možné kandidáty do:

`dist/verify/v48_app_entrypoint_candidates.txt`

Scan sám nezasahuje do UI. Pokud není mount target jednoznačný, skript raději nic nepřepisuje.

## Ověření

Smoke test:

`tests/runtime/v48_fve_cad_app_connector_smoke_test.js`

Verify skript:

`scripts/verify/verify_v48_fve_cad_app_connector.sh`

Verify navazuje na v47 a kontroluje:

- v47 verify,
- entrypoint scan,
- `node --check` nového runtime modulu,
- `node --check` index exportu,
- `node --check` smoke testu,
- runtime smoke test,
- package guard,
- strict grep,
- `git diff --check`.
