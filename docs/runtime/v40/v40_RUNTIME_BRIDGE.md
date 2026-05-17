# v40 Runtime Bridge

Runtime Bridge je společná integrační vrstva pro LOSKOT FVE & LPS STUDIO PRO.

Cíl: sjednotit návratové hodnoty modulů do formátu:

{ ok, data, warnings, errors }

Pravidla:
- modul nesmí shodit celou aplikaci,
- chyba modulu se vrací přes errors,
- varování se vrací přes warnings,
- LPS risk assessment je zatím placeholder, ne finální normový výpočet,
- Runtime Bridge nezasahuje do Classic PRO vzhledu,
- Runtime Bridge je bez DOM závislostí.

Hlavní soubory:
- src/runtime/appRuntimeBridge.js
- src/runtime/index.js
- tests/runtime/v40_runtime_bridge_smoke_test.js
- scripts/verify/verify_v40_runtime.sh
