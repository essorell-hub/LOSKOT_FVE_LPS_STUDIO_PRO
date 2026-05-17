
import assert from "node:assert/strict";
import {
  REAL_CAD_SYMBOL_DISPLAY_VERSION,
  createRealCadSymbolDisplay,
  safeRealCadSymbolDisplay
} from "../../src/runtime/realCadSymbolDisplay.js";

const display = createRealCadSymbolDisplay({
  rendererOptions: {
    registryOptions: {
      index: {
        symbols: [
          {
            id: "fve.panel.basic",
            symbolKey: "fve.panel.basic",
            category: "fve",
            layerId: "fve-panels",
            assets: { svg: "src/assets/cad/symbols/fve/fve_panel_basic.svg" }
          }
        ]
      }
    }
  },
  visualBinding: {
    getRenderPacket(payload) {
      return {
        ok: true,
        data: {
          viewModel: payload.viewModel
        },
        warnings: [],
        errors: []
      };
    }
  }
});

assert.equal(REAL_CAD_SYMBOL_DISPLAY_VERSION, "v51-real-cad-symbol-display");
assert.equal(display.classicProUnchanged, true);

const result = display.getSymbolDisplayPacket({
  viewModel: {
    panels: [
      { id: "P1", panelId: "P1", x: 10, y: 20, width: 32, height: 18, selected: true, layerId: "fve-panels" },
      { id: "P2", panelId: "P2", x: 50, y: 20, width: 32, height: 18, status: "WARNING", layerId: "fve-panels" }
    ]
  }
});

assert.equal(result.ok, true);
assert.equal(result.data.symbolPacket.sourcePanelCount, 2);
assert.equal(result.data.symbolPacket.symbolCount, 2);
assert.equal(result.data.symbolPacket.elements[0].data.panelId, "P1");
assert.equal(result.data.classicProUnchanged, true);

const svg = display.getSymbolSvgOverlay({
  viewModel: {
    panels: [{ id: "P3", panelId: "P3", x: 1, y: 2, width: 10, height: 10 }]
  }
});
assert.equal(svg.ok, true);
assert.match(svg.data, /data-panel-id="P3"/);

const summary = display.getDisplaySummary({
  viewModel: { panels: [{ id: "P4", panelId: "P4" }] }
});
assert.equal(summary.ok, true);
assert.equal(summary.data.classicProUnchanged, true);

const unsupported = display.run("missing", {});
assert.equal(unsupported.ok, false);

const safe = safeRealCadSymbolDisplay({
  visualBinding: {
    getRenderPacket(payload) {
      return { ok: true, data: { viewModel: payload.viewModel }, warnings: [], errors: [] };
    }
  }
});
assert.equal(safe.getDisplaySummary({ viewModel: { panels: [] } }).ok, true);

console.log("v51 real cad symbol display smoke test OK");

