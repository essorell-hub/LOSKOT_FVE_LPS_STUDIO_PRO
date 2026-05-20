function finding(code, severity, message, path) {
  return { code, severity, message, path, source: "lps-spd-grounding-v823" };
}

export function evaluateLpsSpdGrounding(project = {}) {
  const lps = project.lps || {};
  const spd = project.spd || {};
  const grounding = project.grounding || {};
  const qaFindings = [
    ...collectLpsQa(project),
    ...collectSpdQa(project),
    ...collectGroundingQa(project)
  ];
  return {
    ok: !qaFindings.some((item) => ["ERROR", "BLOCKER"].includes(item.severity)),
    data: {
      lpsClass: lps.lpsClass || lps.class || null,
      riskLevel: lps.riskLevel || null,
      spdTypes: Array.isArray(spd.devices) ? spd.devices.map((device) => device.type).filter(Boolean) : [],
      groundingResistanceOhm: grounding.resistanceOhm ?? null,
      bonding: grounding.bonding || null,
      source: "lpsSpdApplicationServiceV823"
    },
    warnings: qaFindings.filter((item) => item.severity === "WARNING").map((item) => item.code),
    errors: qaFindings.filter((item) => item.severity === "ERROR").map((item) => item.code),
    qaFindings
  };
}

export function collectLpsQa(project = {}) {
  const lps = project.lps || {};
  const findings = [];
  if (!lps.lpsClass && !lps.class) findings.push(finding("LPS_CLASS_MISSING", "WARNING", "LPS class is missing.", "$.lps"));
  if (lps.riskCalculation?.isPlaceholder === true && lps.riskCalculation?.normative === false) {
    findings.push(finding("LPS_RISK_PLACEHOLDER_DECLARED", "WARNING", "LPS risk calculation is explicitly marked as non-normative placeholder.", "$.lps.riskCalculation"));
  }
  return findings;
}

export function collectSpdQa(project = {}) {
  const spd = project.spd || {};
  const findings = [];
  if (!Array.isArray(spd.devices) || spd.devices.length === 0) findings.push(finding("SPD_DEVICES_MISSING", "WARNING", "SPD devices are missing.", "$.spd.devices"));
  return findings;
}

export function collectGroundingQa(project = {}) {
  const grounding = project.grounding || {};
  const findings = [];
  if (grounding.resistanceOhm === undefined || grounding.resistanceOhm === null) findings.push(finding("GROUNDING_RESISTANCE_MISSING", "WARNING", "Grounding resistance is missing.", "$.grounding.resistanceOhm"));
  return findings;
}

export function createLpsSpdApplicationServiceV823() {
  return {
    evaluateLpsSpdGrounding,
    collectLpsQa,
    collectSpdQa,
    collectGroundingQa
  };
}
