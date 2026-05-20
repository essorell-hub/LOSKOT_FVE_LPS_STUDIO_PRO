import assert from "node:assert";
import { readFileSync } from "node:fs";

import { createFvePanelPlacementSummary, evaluateFvePanelPlacementQa, normalizeFvePanelPlacements } from "../../src/fve/fvePanelPlacementModelV531.js";

const ok = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_ok.json", "utf8"));
const bad = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_with_errors.json", "utf8"));

const normalized = normalizeFvePanelPlacements(ok);
assert.strictEqual(normalized.panels.length, 2);
assert.strictEqual(normalized.panels[0].panelId, "panel-1");
assert.strictEqual(normalized.qaFindings.length, 0);

const summary = createFvePanelPlacementSummary(ok);
assert.strictEqual(summary.panelCount, 2);
assert.strictEqual(summary.pendingCount, 0);
assert.strictEqual(summary.qaSummary.total, 0);

const findings = evaluateFvePanelPlacementQa(bad);
assert.ok(findings.some((finding) => finding.code === "FVE-PANEL-001"));
assert.ok(findings.some((finding) => finding.code === "FVE-PANEL-002"));

const pendingPlacement = evaluateFvePanelPlacementQa({
  ...bad,
  fve: { ...bad.fve, panels: [{ panelId: "pending", moduleId: "module-1", powerWp: 400, placementPending: true }] },
});
assert.strictEqual(pendingPlacement.some((finding) => finding.code === "FVE-PANEL-002"), false);

console.log("V531_FVE_PANEL_PLACEMENT_TEST=PASS");
