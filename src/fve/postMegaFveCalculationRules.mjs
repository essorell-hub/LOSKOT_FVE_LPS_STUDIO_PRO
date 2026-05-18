// POST-MEGA V4 NIGHT FACTORY
// FVE calculation rule helpers. These are guardrails, not final design authority.

export const POST_MEGA_FVE_RULES_VERSION = "post-mega-v4-fve-rules-1";

export function calculateStringVoltage({ moduleVoc = 0, modulesInSeries = 0, tempCoeffPctPerC = -0.28, minTempC = -10, stcTempC = 25 } = {}) {
  const delta = stcTempC - minTempC;
  const correction = 1 + Math.abs(tempCoeffPctPerC) / 100 * delta;
  return moduleVoc * modulesInSeries * correction;
}

export function calculateStringPowerKw({ modulePowerWp = 0, moduleCount = 0 } = {}) {
  return modulePowerWp * moduleCount / 1000;
}

export function checkStringAgainstInverter({ stringVoc = 0, inverterMaxDcV = 0, stringCurrentA = 0, inverterMaxCurrentA = 0 } = {}) {
  const findings = [];
  if (inverterMaxDcV > 0 && stringVoc > inverterMaxDcV) findings.push("string_voc_above_inverter_limit");
  if (inverterMaxCurrentA > 0 && stringCurrentA > inverterMaxCurrentA) findings.push("string_current_above_inverter_limit");
  return { ok: findings.length === 0, findings };
}

export function createFveRuleSummary() {
  return {
    version: POST_MEGA_FVE_RULES_VERSION,
    checks: ["string_voc", "string_current", "string_power_kw", "dc_ac_ratio_placeholder"]
  };
}
