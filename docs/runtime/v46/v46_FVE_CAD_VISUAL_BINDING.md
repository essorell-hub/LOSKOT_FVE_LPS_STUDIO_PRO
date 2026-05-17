# v46 FVE CAD Visual Binding Foundation

v46 přidává DOM-free vizuální binding vrstvu nad v45 FVE CAD panel interaction bridge.

## Cíl v46

- převést v45 CAD view-model na render packet,
- připravit SVG markup pro FVE CAD náhled,
- připravit event binding plán pro budoucí UI napojení,
- připravit inspector model pro Classic PRO panel,
- mapovat vizuální akce na runtime příkazy,
- zachovat Classic PRO vzhled,
- nezasahovat do preview HTML,
- neměnit `package.json` ani `package-lock.json`.

## Přidané runtime API

Soubor:

`src/runtime/fveCadVisualBinding.js`

Exporty:

- `FVE_CAD_VISUAL_BINDING_VERSION`
- `createFveCadVisualBinding(options)`
- `safeFveCadVisualBinding(options)`

Hlavní funkce:

- `getRenderPacket(payload)`
- `getSvgMarkup(payload)`
- `getElementPlan(payload)`
- `getEventBindingPlan()`
- `getInspectorModel(payload)`
- `dispatchVisualAction(command, payload)`
- `run(command, payload)`

## Poznámka

v46 ještě přímo nepřepisuje existující UI komponenty ani preview HTML. Připravuje bezpečný render packet a příkazovou vrstvu, aby bylo možné v další verzi napojit viditelný CAD náhled bez rozbití Classic PRO vzhledu.

## Ověření

Smoke test:

`tests/runtime/v46_fve_cad_visual_binding_smoke_test.js`

Verify skript:

`scripts/verify/verify_v46_fve_cad_visual_binding.sh`
