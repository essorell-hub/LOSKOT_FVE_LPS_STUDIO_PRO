import { createLocalId } from "../shared/localId.js";

export const LPS_RISK_PLACEHOLDER_VERSION = "v31-preview-placeholder";

export const LPS_RISK_PLACEHOLDER_STATUS = Object.freeze({
  OK: "OK",
  WARNING: "WARNING",
  ERROR: "ERROR",
  PLACEHOLDER: "PLACEHOLDER",
  REVIEW_REQUIRED: "REVIEW_REQUIRED"
});

export function createRiskInputDefaults(project = {}) {
  return {
    projectId: project.projectId || project.id || "unknown-project",
    lps: project.lps || { objects: [] }
  };
}

export function createDefaultRiskAssessmentInput(project = {}) {
  return createRiskInputDefaults(project);
}

function normalizeLpsObjects(input = {}) {
  if (Array.isArray(input)) return input;
  if (Array.isArray(input.objects)) return input.objects;
  if (Array.isArray(input.lpsObjects)) return input.lpsObjects;
  if (input.lps && Array.isArray(input.lps.objects)) return input.lps.objects;
  if (input.project && input.project.lps && Array.isArray(input.project.lps.objects)) return input.project.lps.objects;
  return [];
}

function objectTypeOf(item = {}) {
  return String(item.type || item.geometryType || item.category || item.kind || "").toLowerCase();
}

export function createRiskAssessmentPlaceholder(input = {}) {
  const objects = normalizeLpsObjects(input);

  const airTerminationCount = objects.filter((item) => {
    const type = objectTypeOf(item);
    return type.includes("air") || type.includes("termination") || type.includes("jimac") || type.includes("jímač") || type.includes("rod");
  }).length;

  const downConductorCount = objects.filter((item) => {
    const type = objectTypeOf(item);
    return type.includes("down") || type.includes("conductor") || type.includes("svod");
  }).length;

  const spdCount = objects.filter((item) => objectTypeOf(item).includes("spd")).length;
  const hviCount = objects.filter((item) => objectTypeOf(item).includes("hvi")).length;

  return {
    id: createLocalId("lps-risk"),
    version: LPS_RISK_PLACEHOLDER_VERSION,
    status: LPS_RISK_PLACEHOLDER_STATUS.PLACEHOLDER,
    ok: true,
    isPlaceholder: true,
    normative: false,
    standard: "ČSN EN 62305-2",
    note: "Placeholder nenahrazuje normový výpočet rizika.",
    counts: {
      objects: objects.length,
      airTerminationObjects: airTerminationCount,
      downConductors: downConductorCount,
      spdObjects: spdCount,
      hviObjects: hviCount
    },
    warnings: [
      "Toto je pouze placeholder výpočtu rizika LPS.",
      "Nejde o plnohodnotný normový výpočet podle ČSN EN 62305-2.",
      "Výsledek nesmí být použit jako finální projekční výpočet rizika."
    ],
    errors: []
  };
}

export function runRiskAssessmentPlaceholder(input = {}) {
  return createRiskAssessmentPlaceholder(input);
}

export function calculateRiskAssessmentPlaceholder(input = {}) {
  return createRiskAssessmentPlaceholder(input);
}

export function assessLpsRiskPlaceholder(input = {}) {
  return createRiskAssessmentPlaceholder(input);
}

export function createLpsRiskAssessmentPlaceholder(input = {}) {
  return createRiskAssessmentPlaceholder(input);
}

export function runLpsRiskAssessmentPlaceholder(input = {}) {
  return createRiskAssessmentPlaceholder(input);
}

export function calculateLpsRiskPreview(input = {}) {
  return createRiskAssessmentPlaceholder(input);
}

export function createRiskAssessmentSummary(input = {}) {
  const result = createRiskAssessmentPlaceholder(input);
  return {
    status: result.status,
    ok: result.ok,
    isPlaceholder: result.isPlaceholder,
    normative: result.normative,
    standard: result.standard,
    counts: result.counts,
    warnings: result.warnings,
    errors: result.errors,
    summary: "LPS risk assessment je zatím pouze preview placeholder."
  };
}

export function isRiskAssessmentPlaceholder(result = {}) {
  return result.isPlaceholder === true || result.status === LPS_RISK_PLACEHOLDER_STATUS.PLACEHOLDER;
}

export default {
  LPS_RISK_PLACEHOLDER_VERSION,
  LPS_RISK_PLACEHOLDER_STATUS,
  createRiskInputDefaults,
  createDefaultRiskAssessmentInput,
  createRiskAssessmentPlaceholder,
  runRiskAssessmentPlaceholder,
  calculateRiskAssessmentPlaceholder,
  assessLpsRiskPlaceholder,
  createLpsRiskAssessmentPlaceholder,
  runLpsRiskAssessmentPlaceholder,
  calculateLpsRiskPreview,
  createRiskAssessmentSummary,
  isRiskAssessmentPlaceholder
};
