# V50 FIX1 – CAD SYMBOL RENDERER

## Důvod opravy

V50 původně selhala na smoke testu:

`actual = symbolFallback`
`expected = symbol`

Příčina:
- V49 `cadSymbolRegistry.getSymbol()` vrací přímo symbol objekt, ne runtime result s `ok/data`.
- V50 renderer čekal runtime result a proto správný symbol vyhodnotil jako nenalezený.
- V50 renderer současně nečetl `svgPath` z V49 symbol modelu.

## Oprava

- `getRegistrySymbol()` normalizuje oba formáty:
  - přímý symbol objekt z V49,
  - runtime result s `data`,
  - runtime result se `symbol`.
- `symbolAssetForState()` nově čte:
  - `assets.states`,
  - `assets.svg`,
  - `svgPath`,
  - `svg`,
  - `asset`,
  - `png["64"]` / `png["32"]`.
- Smoke test používá V49 kompatibilní `svgPath` model.

## Bezpečnost

- Nemění `package.json`.
- Nemění preview HTML.
- Zachovává Classic PRO vzhled.
- Fallback zůstává bezpečný pro chybějící symboly.

