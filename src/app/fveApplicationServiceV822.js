function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function evaluateFvePractical(project = {}) {
  const fve = project.fve || {};
  const panels = Number(fve.panelCount || fve.modules || 0);
  const moduleWp = Number(fve.moduleWp || fve.panelWp || 0);
  const dcPowerWp = Number(fve.dcPowerWp || panels * moduleWp || 0);
  const inverterKw = Number(fve.inverterKw || fve.acPowerKw || 0);
  const warnings = [];
  if (!panels) warnings.push("FVE_PANEL_COUNT_MISSING");
  if (!dcPowerWp) warnings.push("FVE_DC_POWER_MISSING");
  if (dcPowerWp && inverterKw && inverterKw * 1000 < dcPowerWp * 0.65) warnings.push("FVE_INVERTER_SIZE_LOW");
  return {
    ok: warnings.length === 0,
    data: {
      panels,
      moduleWp,
      dcPowerWp,
      dcPowerKw: dcPowerWp / 1000,
      inverterKw,
      strings: asArray(fve.strings),
      source: "fveApplicationServiceV822"
    },
    warnings,
    errors: [],
    qaFindings: collectFveQa(project)
  };
}

export function collectFveQa(project = {}) {
  const fve = project.fve || {};
  const findings = [];
  if (!fve.panelCount && !fve.modules) {
    findings.push({ code: "FVE_PANEL_COUNT_MISSING", severity: "WARNING", message: "FVE panel count is missing.", path: "$.fve", source: "fve-v822" });
  }
  if (!fve.dcPowerWp && !(fve.panelCount && (fve.moduleWp || fve.panelWp))) {
    findings.push({ code: "FVE_POWER_MISSING", severity: "WARNING", message: "FVE DC power inputs are incomplete.", path: "$.fve", source: "fve-v822" });
  }
  return findings;
}

export function collectFveBomInputs(project = {}) {
  const fve = project.fve || {};
  return {
    panels: Number(fve.panelCount || fve.modules || 0),
    inverters: asArray(fve.inverters),
    strings: asArray(fve.strings),
    mounting: fve.mounting || null,
    cableRoutes: asArray(fve.cableRoutes)
  };
}

export function createFveApplicationServiceV822() {
  return { evaluateFvePractical, collectFveQa, collectFveBomInputs };
}
