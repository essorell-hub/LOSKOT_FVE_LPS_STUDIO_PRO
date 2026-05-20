import assert from "node:assert";
import { readFileSync } from "node:fs";

import { createFveStringGroupingSummary, evaluateFveStringGroupingQa, normalizeFveStringGroups } from "../../src/fve/fveStringGroupingModelV532.js";

const ok = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_ok.json", "utf8"));
const bad = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_with_errors.json", "utf8"));

const groups = normalizeFveStringGroups(ok);
assert.strictEqual(groups.groups.length, 1);
assert.strictEqual(groups.groups[0].stringId, "string-1");
assert.strictEqual(groups.groups[0].panelIds.length, 2);
assert.strictEqual(groups.qaFindings.length, 0);

const summary = createFveStringGroupingSummary(ok);
assert.strictEqual(summary.stringCount, 1);
assert.strictEqual(summary.unassignedCount, 0);

const findings = evaluateFveStringGroupingQa(bad);
assert.ok(findings.some((finding) => finding.code === "FVE-STRING-001"));
assert.ok(findings.some((finding) => finding.code === "FVE-STRING-002"));

const unassigned = evaluateFveStringGroupingQa({
  ...ok,
  fve: { ...ok.fve, strings: [{ stringId: "manual", moduleCount: 1, mpptId: "unassigned" }] },
});
assert.strictEqual(unassigned.some((finding) => finding.code === "FVE-STRING-002"), false);

console.log("V532_FVE_STRING_GROUPING_TEST=PASS");
