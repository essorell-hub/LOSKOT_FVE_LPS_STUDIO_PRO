
import assert from "node:assert/strict";
import {
  FVE_CALCULATION_ENGINE_VERSION,
  createFveCalculationEngine,
  safeFveCalculationEngine
} from "../../src/runtime/fveCalculationEngine.js";

assert.equal(FVE_CALCULATION_ENGINE_VERSION, "v55-fve-calculation-engine-foundation");
const engine = createFveCalculationEngine();
assert.equal(engine.classicProUnchanged, true);

const project = {
  fve: {
    panels: [
      { id: "P1", wattPeak: 450, vocV: 49, vmpV: 41, iscA: 13, impA: 12 },
      { id: "P2", wattPeak: 450, vocV: 49, vmpV: 41, iscA: 13, impA: 12 }
    ],
    strings: [
      { id: "S1", panelIds: ["P1", "P2"], inverterId: "I1", mpptIndex: 1 }
    ],
    inverters: [
      { id: "I1", acPowerKw: 5, dcMaxVoltageV: 1000, mpptCount: 2, mpptMinVoltageV: 80, mpptMaxVoltageV: 800, mpptMaxCurrentA: 20 }
    ],
    dcRoutes: []
  }
};

const summary = engine.calculateFveSummary(project);
assert.equal(summary.ok, true);
assert.equal(summary.data.panelCount, 2);
assert.equal(summary.data.totalKwp, 0.9);
assert.equal(summary.data.classicProUnchanged, true);

const strings = engine.calculateStringElectricals(project);
assert.equal(strings.ok, true);
assert.equal(strings.data.strings[0].stringVoc, 98);
assert.equal(strings.data.strings[0].stringIsc, 13);

const checks = engine.calculateInverterChecks(project);
assert.equal(checks.ok, true);
assert.equal(checks.data.checks.length, 0);

const bad = engine.runFveQa({
  fve: {
    panels: [{ id: "P1" }],
    strings: [{ id: "S1", panelIds: ["P1"], inverterId: "I404", mpptIndex: 9 }],
    inverters: []
  }
});
assert.equal(bad.ok, true);
assert.equal(bad.data.status, "FAIL");

const doc = engine.buildDocumentContext(project);
assert.equal(doc.ok, true);
assert.equal(doc.data.classicProUnchanged, true);

const sqlite = engine.buildSqliteSyncPayload(project);
assert.equal(sqlite.ok, true);
assert.equal(sqlite.data.fve_panels.length, 2);

const unsupported = engine.run("missing", {});
assert.equal(unsupported.ok, false);

const safe = safeFveCalculationEngine();
assert.equal(safe.calculateFveSummary(project).ok, true);

console.log("v55 fve calculation engine smoke test OK");

