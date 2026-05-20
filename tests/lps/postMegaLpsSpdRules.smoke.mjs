import assert from "node:assert/strict";
import { RISK_CALCULATION_DISCLAIMER, createLpsObjectSummary, createLpsSpdRuleSummary, createSpdPlacementCheck } from "../../src/lps/postMegaLpsSpdRules.mjs";

assert.equal(RISK_CALCULATION_DISCLAIMER.includes("placeholder"), true);
assert.equal(createSpdPlacementCheck({ side: "DC", lpzFrom: "0", lpzTo: "1", hasUpstreamProtection: true }).ok, true);
assert.equal(createSpdPlacementCheck({ side: "AC" }).ok, false);
const summary = createLpsObjectSummary([{ type: "air_termination" }, { type: "air_termination" }]);
assert.equal(summary.byType.air_termination, 2);
assert.equal(createLpsSpdRuleSummary().checks.includes("lpz_boundary"), true);

// V5C_READINESS_DISCLAIMER_ASSERTION
const readinessDisclaimer = RISK_CALCULATION_DISCLAIMER.toLowerCase();
assert.equal(readinessDisclaimer.includes("placeholder"), true);
assert.equal(readinessDisclaimer.includes("not") && readinessDisclaimer.includes("final"), true);
console.log("POST-MEGA V4 LPS SPD rules smoke PASS");
