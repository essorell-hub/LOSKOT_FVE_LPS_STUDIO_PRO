import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { createQaFinding, runQaFeed } from "../validation/qaFeedEngine.js";

function idOf(value, fallback) {
  return value.mpptId || value.inverterId || value.id || fallback;
}

export function createFveMpptBindings(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const stringsByMppt = new Map();

  project.fve.strings.forEach((string) => {
    const mpptId = string.mpptId || "unassigned";
    if (!stringsByMppt.has(mpptId)) stringsByMppt.set(mpptId, []);
    stringsByMppt.get(mpptId).push(string.stringId || string.id || "");
  });

  const bindings = project.fve.mppts.map((mppt, index) => {
    const mpptId = idOf(mppt, `mppt-${index + 1}`);
    return {
      mpptId,
      inverterId: mppt.inverterId || null,
      maxStrings: Number.isFinite(Number(mppt.maxStrings)) ? Number(mppt.maxStrings) : null,
      stringIds: stringsByMppt.get(mpptId) || [],
    };
  });

  return {
    bindings,
    unassignedStringIds: stringsByMppt.get("unassigned") || [],
    qaFindings: evaluateFveMpptBindingQa({ ...project, fve: { ...project.fve, mppts: bindings } }),
  };
}

export function evaluateFveMpptBindingQa(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const bindings = project.fve.mppts.map((mppt) => ({
    ...mppt,
    stringIds: Array.isArray(mppt.stringIds)
      ? mppt.stringIds
      : project.fve.strings.filter((string) => string.mpptId === (mppt.mpptId || mppt.id)).map((string) => string.stringId || string.id || ""),
  }));
  const findings = [];

  bindings.forEach((binding) => {
    const maxStrings = Number(binding.maxStrings);
    if (Number.isFinite(maxStrings) && maxStrings >= 0 && binding.stringIds.length > maxStrings) {
      findings.push(createQaFinding("FVE-MPPT-001", "ERROR", "MPPT must not exceed configured string count limit.", {
        source: "FVE_MPPT_BINDING_V533",
        mpptId: binding.mpptId || binding.id,
        stringCount: binding.stringIds.length,
        maxStrings,
      }));
    }
  });

  return findings;
}

export function createFveMpptBindingSummary(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const bindings = createFveMpptBindings(project);
  const feed = runQaFeed({ fveFindings: bindings.qaFindings, project });

  return {
    bindingCount: bindings.bindings.length,
    unassignedStringCount: bindings.unassignedStringIds.length,
    bindings: bindings.bindings,
    unassignedStringIds: bindings.unassignedStringIds,
    qaFindings: feed.qaFindings,
    qaSummary: feed.qaSummary,
  };
}
