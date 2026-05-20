import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { createQaFinding, runQaFeed } from "../validation/qaFeedEngine.js";

function stringId(string, index) {
  return string.stringId || string.id || `string-${index + 1}`;
}

function panelRefsForString(string, panels) {
  if (Array.isArray(string.panelIds)) return string.panelIds;
  return panels
    .filter((panel) => panel.stringId === string.stringId || panel.stringId === string.id)
    .map((panel) => panel.panelId || panel.id)
    .filter(Boolean);
}

export function normalizeFveStringGroups(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const groups = project.fve.strings.map((string, index) => {
    const panelIds = panelRefsForString(string, project.fve.panels);
    const moduleCount = Number(string.moduleCount || panelIds.length || 0);
    return {
      stringId: stringId(string, index),
      moduleId: string.moduleId || null,
      mpptId: string.mpptId || "unassigned",
      panelIds,
      moduleCount,
      unassigned: !string.mpptId || string.mpptId === "unassigned",
      source: string,
    };
  });

  return {
    groups,
    qaFindings: evaluateFveStringGroupingQa({ ...project, fve: { ...project.fve, strings: groups } }),
  };
}

export function evaluateFveStringGroupingQa(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const mpptIds = new Set(project.fve.mppts.map((mppt) => mppt.mpptId || mppt.id).filter(Boolean));
  const findings = [];

  project.fve.strings.forEach((string, index) => {
    const moduleCount = Number(string.moduleCount || 0);
    const panelIds = panelRefsForString(string, project.fve.panels);
    if (moduleCount <= 0 && panelIds.length === 0) {
      findings.push(createQaFinding("FVE-STRING-001", "ERROR", "String must contain at least one panel.", {
        source: "FVE_STRING_GROUPING_V532",
        stringId: stringId(string, index),
      }));
    }
    if (string.mpptId && string.mpptId !== "unassigned" && !mpptIds.has(string.mpptId)) {
      findings.push(createQaFinding("FVE-STRING-002", "ERROR", "String must be assigned to an existing MPPT or marked as unassigned.", {
        source: "FVE_STRING_GROUPING_V532",
        stringId: stringId(string, index),
        mpptId: string.mpptId,
      }));
    }
  });

  return findings;
}

export function createFveStringGroupingSummary(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const grouping = normalizeFveStringGroups(project);
  const feed = runQaFeed({ fveFindings: grouping.qaFindings, project });

  return {
    stringCount: grouping.groups.length,
    unassignedCount: grouping.groups.filter((group) => group.unassigned).length,
    groups: grouping.groups,
    qaFindings: feed.qaFindings,
    qaSummary: feed.qaSummary,
  };
}
