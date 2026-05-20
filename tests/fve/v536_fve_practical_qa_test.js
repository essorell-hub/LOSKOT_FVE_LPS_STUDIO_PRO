import assert from "node:assert";
import { readFileSync } from "node:fs";

import { createFveOptimizerPlaceholder } from "../../src/fve/fveOptimizerModelV535.js";
import { createFvePracticalSummary, runFvePracticalQa } from "../../src/fve/fvePracticalQaModelV536.js";

const ok = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_ok.json", "utf8"));
const bad = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_with_errors.json", "utf8"));

const optimizer = createFveOptimizerPlaceholder(ok);
assert.strictEqual(optimizer.placeholder, true);
assert.strictEqual(optimizer.normative, false);
assert.strictEqual(optimizer.finalDesign, false);
assert.strictEqual(optimizer.qaFindings.length, 0);

const okQa = runFvePracticalQa(ok);
assert.strictEqual(okQa.releaseGo, true);
assert.strictEqual(okQa.qaSummary.bySeverity.ERROR, 0);

const badQa = runFvePracticalQa(bad);
assert.strictEqual(badQa.releaseGo, false);
assert.ok(badQa.qaFindings.some((finding) => finding.code === "FVE-PANEL-001"));
assert.ok(badQa.qaFindings.some((finding) => finding.code === "FVE-STRING-001"));
assert.ok(badQa.qaFindings.some((finding) => finding.code === "FVE-MPPT-001"));
assert.ok(badQa.qaFindings.some((finding) => finding.code === "FVE-DC-001"));
assert.ok(badQa.qaFindings.some((finding) => finding.code === "FVE-OPT-001"));

const summary = createFvePracticalSummary(ok);
assert.strictEqual(summary.panelCount, 2);
assert.strictEqual(summary.stringCount, 1);
assert.strictEqual(summary.releaseGo, true);

console.log("V536_FVE_PRACTICAL_QA_TEST=PASS");
