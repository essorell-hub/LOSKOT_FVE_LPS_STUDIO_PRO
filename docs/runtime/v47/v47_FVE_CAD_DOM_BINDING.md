# v47 FVE CAD DOM Binding Foundation

v47 navazuje na v46 FVE CAD Visual Binding a přidává bezpečnou DOM/viewport mezivrstvu pro skutečné viditelné napojení FVE panelů do CAD náhledu.

## Cíl v47

- převzít SVG render packet z v46,
- bezpečně vložit SVG do zadaného CAD containeru,
- navázat panelové `click` eventy na runtime výběr panelů,
- navázat pointer drag na `startDrag` / `dragBy` / `endDrag`,
- navázat klávesy šipek na posun výběru,
- poskytnout DOM plán pro pozdější React/Tauri komponentu,
- zachovat Classic PRO vzhled,
- nezasahovat do preview HTML,
- neměnit `package.json` ani `package-lock.json`.

## Přidané runtime API

Soubor:

`src/runtime/fveCadDomBinding.js`

Exporty:

- `FVE_CAD_DOM_BINDING_VERSION`
- `createFveCadDomBinding(options)`
- `safeFveCadDomBinding(options)`

Hlavní funkce:

- `getSnapshot(payload)`
- `getDomPlan()`
- `mount(payload)`
- `refresh(payload)`
- `unmount()`
- `dispatchDomEvent(eventName, payload)`
- `getMountedState()`
- `run(command, payload)`

## Bezpečnostní zásady

- Pokud container neexistuje, vrací se strukturovaná runtime chyba; nevyhazuje se nekontrolovaná výjimka.
- Event listenery se při refresh/unmount odpojí.
- Modul funguje i v Node smoke testu s mock DOM objekty.
- Classic PRO vzhled se nemění; v47 dodává pouze adapter pro budoucí viditelné CAD napojení.

## Ověření

Smoke test:

`tests/runtime/v47_fve_cad_dom_binding_smoke_test.js`

Verify skript:

`scripts/verify/verify_v47_fve_cad_dom_binding.sh`

Verify navazuje na v46 a kontroluje:

- v46 verify,
- `node --check` nového runtime modulu,
- `node --check` index exportu,
- `node --check` smoke testu,
- runtime smoke test,
- package guard,
- strict grep,
- `git diff --check`.
