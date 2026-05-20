import { collectAllQaFindings, summarizeQa } from "./qaApplicationServiceV826.js";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function buildBom(project = {}, inputs = {}) {
  const fve = inputs.fveBomInputs || {};
  const rows = [
    fve.panels ? { code: "FVE_PANEL", name: "PV module", quantity: fve.panels, unit: "pcs" } : null,
    ...asArray(fve.inverters).map((item, index) => ({ code: item.code || `INVERTER_${index + 1}`, name: item.name || "Inverter", quantity: item.quantity || 1, unit: "pcs" })),
    ...asArray(project.spd?.devices).map((item, index) => ({ code: item.code || `SPD_${index + 1}`, name: item.name || "SPD", quantity: item.quantity || 1, unit: "pcs" }))
  ].filter(Boolean);
  return {
    ok: rows.length > 0,
    data: {
      bomId: `bom-${project.projectId || project.id || "project"}`,
      rows,
      source: "exportApplicationServiceV825"
    },
    warnings: rows.length ? [] : ["BOM_EMPTY"],
    errors: [],
    qaFindings: collectAllQaFindings(project, inputs)
  };
}

export function evaluateExportReadiness(project = {}, inputs = {}) {
  const findings = collectAllQaFindings(project, inputs);
  const summary = summarizeQa(findings);
  const documentsReady = inputs.documentsReady !== false;
  const bomReady = inputs.bomReady !== false;
  const exportReady = documentsReady && bomReady && !summary.hasBlockers && !summary.hasErrors;
  return {
    exportReady,
    documentsReady,
    bomReady,
    qaSummary: summary,
    qaFindings: findings,
    blockers: findings.filter((finding) => ["BLOCKER", "ERROR"].includes(finding.severity)).map((finding) => finding.code)
  };
}

export function buildExportPackage(project = {}, inputs = {}) {
  const readiness = evaluateExportReadiness(project, inputs);
  return {
    ok: readiness.exportReady,
    data: {
      exportId: `export-${project.projectId || project.id || "project"}`,
      ready: readiness.exportReady,
      documents: inputs.documents || project.documents || {},
      bom: inputs.bom || project.bom || {},
      readiness
    },
    warnings: readiness.exportReady ? [] : ["EXPORT_NOT_READY"],
    errors: readiness.qaSummary.hasErrors || readiness.qaSummary.hasBlockers ? ["EXPORT_QA_GATE_FAILED"] : [],
    qaFindings: readiness.qaFindings
  };
}

export function createExportApplicationServiceV825() {
  return { buildBom, buildExportPackage, evaluateExportReadiness };
}
