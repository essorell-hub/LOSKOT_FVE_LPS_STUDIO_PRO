import assert from "node:assert";
import { readFileSync } from "node:fs";

import { normalizeUnifiedProject } from "../../src/data/unifiedProjectModelV501.js";
import { validateUnifiedProject } from "../../src/data/unifiedProjectValidatorV502.js";
import { evaluateUnifiedFve } from "../../src/fve/unifiedFveAdapterV511.js";
import { createFvePanelPlacementSummary } from "../../src/fve/fvePanelPlacementModelV531.js";
import { createFveStringGroupingSummary } from "../../src/fve/fveStringGroupingModelV532.js";
import { createFveMpptBindingSummary } from "../../src/fve/fveInverterMpptBindingModelV533.js";
import { createFveDcRouteSummary } from "../../src/fve/fveDcRouteModelV534.js";
import { createFvePracticalSummary } from "../../src/fve/fvePracticalQaModelV536.js";

const ok = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_ok.json", "utf8"));
const bad = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_with_errors.json", "utf8"));

const project = normalizeUnifiedProject(ok);
assert.strictEqual(validateUnifiedProject(project).valid, true);

const baseline = evaluateUnifiedFve(project);
assert.strictEqual(baseline.releaseGo, true);
assert.strictEqual(baseline.strings.length, 1);

const placement = createFvePanelPlacementSummary(project);
const grouping = createFveStringGroupingSummary(project);
const mppt = createFveMpptBindingSummary(project);
const routes = createFveDcRouteSummary(project);
const practical = createFvePracticalSummary(project);

assert.strictEqual(placement.panelCount, 2);
assert.strictEqual(grouping.stringCount, 1);
assert.strictEqual(mppt.bindingCount, 1);
assert.strictEqual(routes.routeCount, 1);
assert.strictEqual(practical.releaseGo, true);

const badPractical = createFvePracticalSummary(bad);
assert.strictEqual(badPractical.releaseGo, false);
assert.ok(badPractical.qaSummary.total >= 5);

console.log("V580_FVE_PRACTICAL_INTEGRATION_TEST=PASS");
