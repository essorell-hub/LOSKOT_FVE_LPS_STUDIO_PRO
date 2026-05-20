import assert from "node:assert";
import { readFileSync } from "node:fs";

import { createFveMpptBindings, createFveMpptBindingSummary, evaluateFveMpptBindingQa } from "../../src/fve/fveInverterMpptBindingModelV533.js";

const ok = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_ok.json", "utf8"));
const bad = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_with_errors.json", "utf8"));

const bindings = createFveMpptBindings(ok);
assert.strictEqual(bindings.bindings.length, 1);
assert.deepStrictEqual(bindings.bindings[0].stringIds, ["string-1"]);
assert.strictEqual(bindings.qaFindings.length, 0);

const summary = createFveMpptBindingSummary(ok);
assert.strictEqual(summary.bindingCount, 1);
assert.strictEqual(summary.unassignedStringCount, 0);

const findings = evaluateFveMpptBindingQa(bad);
assert.ok(findings.some((finding) => finding.code === "FVE-MPPT-001"));

const noLimit = evaluateFveMpptBindingQa({
  ...bad,
  fve: { ...bad.fve, mppts: [{ mpptId: "mppt-1" }] },
});
assert.strictEqual(noLimit.some((finding) => finding.code === "FVE-MPPT-001"), false);

console.log("V533_FVE_MPPT_BINDING_TEST=PASS");
