import assert from "node:assert/strict";
import { CAD_SYMBOL_REGISTRY_VERSION, createCadSymbolRegistry, safeCadSymbolRegistry } from "../../src/runtime/cadSymbolRegistry.js";

const registry = createCadSymbolRegistry();
assert.equal(CAD_SYMBOL_REGISTRY_VERSION, "v49-cad-symbol-registry");
assert.equal(registry.classicProUnchanged, true);
assert.ok(registry.getSummary().ok);
assert.equal(registry.getSummary().count >= 3, true);
assert.ok(registry.getCategories().includes("fve"));
assert.ok(registry.getLayers().includes("fve.panels"));
assert.equal(registry.hasSymbol("fve.panel.basic"), true);
assert.equal(registry.hasSymbol("missing.symbol"), false);
assert.equal(registry.listSymbols({ category: "fve" })[0].id, "fve.panel.basic");
assert.equal(registry.listSymbols({ usage: "documentation" }).length >= 3, true);
assert.equal(registry.getSymbol("missing.symbol").fallback, true);
assert.equal(registry.getSymbol("missing.symbol", { strict: true }), null);
assert.equal(registry.getAssetReference("fve.panel.basic", { prefer: "svg" }).type, "svg");
assert.equal(registry.getAssetReference("fve.panel.basic", { prefer: "png", size: 64 }).type, "png");
assert.equal(registry.run("getSymbol", { id: "electro.spd.dc.basic" }).symbol.category, "electro");
assert.equal(registry.run("nope", {}).code, "UNSUPPORTED_COMMAND");

const custom = createCadSymbolRegistry({ index: { version: "custom-test", symbols: [{ id: "x.one", category: "test", usage: ["cad"], svgPath: "x.svg" }, { id: "x.one", category: "duplicate", usage: ["cad"], svgPath: "duplicate.svg" }] } });
assert.equal(custom.getSummary().count, 1);
assert.equal(custom.validateIndex().duplicateCount, 1);

const safe = safeCadSymbolRegistry({ index: { symbols: [{ id: "safe.ok", category: "safe", svgPath: "safe.svg" }] } });
assert.equal(safe.hasSymbol("safe.ok"), true);
assert.equal(safe.getSummary().classicProUnchanged, true);
console.log("v49 CAD symbol registry smoke test OK");
