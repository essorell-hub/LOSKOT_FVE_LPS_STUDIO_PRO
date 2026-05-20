import assert from "node:assert";
import { readFileSync } from "node:fs";

import { createFveDcRouteSummary, evaluateFveDcRouteQa, normalizeFveDcRoutes } from "../../src/fve/fveDcRouteModelV534.js";

const ok = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_ok.json", "utf8"));
const bad = JSON.parse(readFileSync("tests/fixtures/v531_v580/fve_practical_project_with_errors.json", "utf8"));

const routes = normalizeFveDcRoutes(ok);
assert.strictEqual(routes.routes.length, 1);
assert.strictEqual(routes.routes[0].lengthM, 12);
assert.strictEqual(routes.qaFindings.length, 0);

const summary = createFveDcRouteSummary(ok);
assert.strictEqual(summary.routeCount, 1);
assert.strictEqual(summary.totalLengthM, 12);

const findings = evaluateFveDcRouteQa(bad);
assert.ok(findings.some((finding) => finding.code === "FVE-DC-001"));

const pending = evaluateFveDcRouteQa({
  ...bad,
  fve: { ...bad.fve, dcRoutes: [{ routeId: "pending", lengthM: 0, pending: true }] },
});
assert.strictEqual(pending.length, 0);

console.log("V534_FVE_DC_ROUTE_TEST=PASS");
