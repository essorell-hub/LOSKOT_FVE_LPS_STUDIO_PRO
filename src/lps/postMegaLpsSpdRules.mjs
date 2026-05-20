// POST-MEGA V4 NIGHT FACTORY
// LPS/SPD rule helpers. Risk calculation remains a placeholder and is not a final normative calculation.

export const POST_MEGA_LPS_SPD_RULES_VERSION = "post-mega-v4-lps-spd-rules-1";

export const RISK_CALCULATION_DISCLAIMER = "Risk calculation placeholder only. Not a final normative risk assessment.";

export function createSpdPlacementCheck({ side = "", lpzFrom = "", lpzTo = "", hasUpstreamProtection = false } = {}) {
  const findings = [];
  if (!side) findings.push("missing_spd_side");
  if (!lpzFrom || !lpzTo) findings.push("missing_lpz_boundary");
  if (!hasUpstreamProtection) findings.push("upstream_protection_not_confirmed");
  return { ok: findings.length === 0, findings, disclaimer: RISK_CALCULATION_DISCLAIMER };
}

export function createLpsObjectSummary(objects = []) {
  const byType = {};
  for (const object of objects) {
    const type = object.type || "unknown";
    byType[type] = (byType[type] || 0) + 1;
  }
  return { version: POST_MEGA_LPS_SPD_RULES_VERSION, count: objects.length, byType, disclaimer: RISK_CALCULATION_DISCLAIMER };
}

export function createLpsSpdRuleSummary() {
  return {
    version: POST_MEGA_LPS_SPD_RULES_VERSION,
    disclaimer: RISK_CALCULATION_DISCLAIMER,
    checks: ["spd_side", "lpz_boundary", "upstream_protection", "lps_object_counts"]
  };
}
