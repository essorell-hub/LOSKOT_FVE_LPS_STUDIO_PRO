import assert from "node:assert/strict";

import {
  CAD_SYMBOL_RENDERER_VERSION,
  createCadSymbolRenderer,
  safeCadSymbolRenderer
} from "../../src/runtime/cadSymbolRenderer.js";

function assertRuntimeResult(result, label) {
  assert.equal(typeof result, "object", `${label}: result object`);
  assert.equal(typeof result.ok, "boolean", `${label}: ok boolean`);
  assert.equal(Array.isArray(result.warnings), true, `${label}: warnings array`);
  assert.equal(Array.isArray(result.errors), true, `${label}: errors array`);
  assert.equal(typeof result.meta, "object", `${label}: meta object`);
}

const sampleIndex = {
  symbols: [
    {
      id: "fve.panel.basic",
      name: "FVE panel",
      category: "fve",
      usage: ["cad", "documentation"],
      layerId: "fve-panels",
      state: "normal",
      svgPath: "src/assets/cad/symbols/fve/fve_panel_basic.svg",
      png: {
        "32": "src/assets/cad/png/32/fve_panel_basic.png",
        "64": "src/assets/cad/png/64/fve_panel_basic.png"
      },
      viewBox: "0 0 64 64",
      tags: ["panel", "pv", "module"]
    },
    {
      id: "lps.air_terminal.basic",
      name: "Jímač",
      category: "lps",
      usage: ["cad", "documentation"],
      layerId: "lps-air-terminals",
      state: "normal",
      svgPath: "src/assets/cad/symbols/lps/lps_air_terminal_basic.svg",
      viewBox: "0 0 64 64",
      tags: ["lps", "air terminal"]
    }
  ]
};

assert.equal(CAD_SYMBOL_RENDERER_VERSION, "v50-cad-symbol-renderer-fix1");

const renderer = createCadSymbolRenderer({
  registryOptions: {
    index: sampleIndex
  }
});

assert.equal(renderer.version, "v50-cad-symbol-renderer-fix1");
assert.equal(renderer.classicProUnchanged, true);

const single = renderer.renderSymbol("fve.panel.basic", {
  id: "P1",
  panelId: "P1",
  cadObjectId: "fve-panel:P1",
  x: 10,
  y: 20,
  width: 32,
  height: 18,
  selected: true,
  layerId: "fve-panels"
});

assertRuntimeResult(single, "renderSymbol");
assert.equal(single.ok, true);
assert.equal(single.data.type, "symbol");
assert.equal(single.data.symbolId, "fve.panel.basic");
assert.equal(single.data.state, "selected");
assert.equal(single.data.fallback, false);
assert.equal(single.data.data.panelId, "P1");
assert.equal(single.data.classicProUnchanged, true);

const many = renderer.renderMany([
  {
    symbolId: "fve.panel.basic",
    panelId: "P1",
    x: 1,
    y: 2,
    width: 30,
    height: 20
  },
  {
    symbolId: "lps.air_terminal.basic",
    cadObjectId: "lps:AT1",
    x: 30,
    y: 40,
    width: 10,
    height: 10
  }
]);

assertRuntimeResult(many, "renderMany");
assert.equal(many.ok, true);
assert.equal(many.data.counts.requested, 2);
assert.equal(many.data.counts.rendered, 2);
assert.equal(many.data.counts.fallback, 0);

const missing = renderer.renderSymbol("missing.symbol", {
  id: "M1",
  x: 0,
  y: 0
});

assertRuntimeResult(missing, "missing symbol");
assert.equal(missing.ok, true);
assert.equal(missing.data.type, "symbolFallback");
assert.equal(missing.data.fallback, true);
assert.equal(missing.errors.length, 0);

const fallback = renderer.renderFallbackSymbol("manual test", {
  id: "F1",
  x: 3,
  y: 4
});

assertRuntimeResult(fallback, "manual fallback");
assert.equal(fallback.ok, true);
assert.equal(fallback.data.fallback, true);
assert.equal(fallback.data.reason, "manual test");

const summary = renderer.getRendererSummary();
assertRuntimeResult(summary, "summary");
assert.equal(summary.ok, true);
assert.equal(summary.data.version, "v50-cad-symbol-renderer-fix1");
assert.equal(summary.data.classicProUnchanged, true);

const unsupported = renderer.run("notExistingCommand", {});
assertRuntimeResult(unsupported, "unsupported");
assert.equal(unsupported.ok, false);
assert.match(unsupported.errors[0].message, /Unsupported command/);

const runSingle = renderer.run("renderSymbol", {
  symbolId: "fve.panel.basic",
  placement: {
    id: "P2",
    panelId: "P2",
    x: 5,
    y: 6
  }
});
assertRuntimeResult(runSingle, "run renderSymbol");
assert.equal(runSingle.ok, true);
assert.equal(runSingle.data.data.panelId, "P2");

const brokenRegistryRenderer = createCadSymbolRenderer({
  registry: {}
});
const broken = brokenRegistryRenderer.renderSymbol("fve.panel.basic", { id: "broken" });
assertRuntimeResult(broken, "broken registry");
assert.equal(broken.ok, true);
assert.equal(broken.data.fallback, true);

const safe = safeCadSymbolRenderer({
  registryOptions: {
    index: sampleIndex
  }
});
const safeResult = safe.renderSymbol("fve.panel.basic", {
  id: "SAFE1",
  x: 1,
  y: 1
});
assertRuntimeResult(safeResult, "safe renderer");
assert.equal(safeResult.ok, true);
assert.equal(safeResult.data.type, "symbol");

console.log("v50 cad symbol renderer fix1 smoke test OK");

