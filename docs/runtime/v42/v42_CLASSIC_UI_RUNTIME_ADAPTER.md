# v42 Classic UI Runtime Adapter

Classic UI Runtime Adapter připravuje bezpečné napojení Classic PRO UI na runtime stav.

Tato verze nemění HTML preview, CSS ani schválený vzhled.

Účel:
- číst hodnoty z App State Controlleru,
- bindovat textové hodnoty do UI targetů,
- přijímat UI akce typu navigate, selectModule, updateProject, setSelection, updateUi,
- po změně stavu bezpečně refreshnout bindingy,
- nikdy neshodit aplikaci kvůli chybě UI bindingu.

Soubor: src/runtime/classicUiRuntimeAdapter.js
Test: tests/runtime/v42_classic_ui_runtime_adapter_smoke_test.js
Verify: scripts/verify/verify_v42_classic_ui_runtime_adapter.sh
