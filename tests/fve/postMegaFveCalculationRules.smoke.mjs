import assert from "node:assert/strict";
import { calculateStringPowerKw, calculateStringVoltage, checkStringAgainstInverter, createFveRuleSummary } from "../../src/fve/postMegaFveCalculationRules.mjs";

const voc = calculateStringVoltage({ moduleVoc: 50, modulesInSeries: 10 });
assert.equal(voc > 500, true);
assert.equal(calculateStringPowerKw({ modulePowerWp: 450, moduleCount: 20 }), 9);
assert.equal(checkStringAgainstInverter({ stringVoc: 1100, inverterMaxDcV: 1000 }).ok, false);
assert.equal(createFveRuleSummary().checks.includes("string_voc"), true);
console.log("POST-MEGA V4 FVE rules smoke PASS");
