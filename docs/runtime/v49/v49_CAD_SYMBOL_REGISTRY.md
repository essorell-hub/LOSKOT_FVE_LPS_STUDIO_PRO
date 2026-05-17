# v49 CAD SYMBOL REGISTRY SAFE PACK

## Účel
v49 přidává bezpečnou mezivrstvu pro práci s CAD/FVE/LPS/elektro symboly. Nemění Classic PRO vzhled, preview HTML ani existující CAD/FVE/LPS moduly.

## Architektura
```text
V06 symbol library -> symbol-index.json -> cadSymbolRegistry -> cadSymbolRenderer -> CAD render packet -> DOM/app connector
```

## Runtime API
- `createCadSymbolRegistry(options)`
- `safeCadSymbolRegistry(options)`
- `listSymbols(filters)`
- `getSymbol(id, opts)`
- `hasSymbol(id)`
- `getCategories()`
- `getLayers()`
- `getProfiles()`
- `getStates()`
- `getAssetReference(id, opts)`
- `validateIndex()`
- `getSummary()`
- `run(command, payload)`

## Bezpečnost
- DOM-free runtime.
- Chybějící symbol vrací fallback, ne výjimku.
- Duplicitní ID se přeskočí a vykáže jako warning.
- Vše vrací `classicProUnchanged: true`.
