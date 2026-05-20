import { createQaFinding, runQaFeed } from "../validation/qaFeedEngine.js";
import { normalizeUnifiedProject } from "./unifiedProjectModelV501.js";

function idSet(items, keys) {
  const set = new Set();
  items.forEach((item) => {
    keys.forEach((key) => {
      if (item && item[key]) set.add(item[key]);
    });
  });
  return set;
}

function addMissing(findings, code, message, details) {
  findings.push(createQaFinding(code, "WARN", message, { source: "UNIFIED_PROJECT_RELATIONS", ...details }));
}

export function validateUnifiedProjectRelations(input = {}) {
  const project = normalizeUnifiedProject(input);
  const findings = [];
  const moduleIds = idSet(project.fve.modules, ["moduleId", "id"]);
  const inverterIds = idSet(project.fve.inverters, ["inverterId", "id"]);
  const mpptIds = idSet(project.fve.mppts, ["mpptId", "id"]);
  const layerIds = idSet(project.cad.layers, ["layerId", "id"]);

  project.fve.strings.forEach((string, index) => {
    if (string.moduleId && moduleIds.size > 0 && !moduleIds.has(string.moduleId)) {
      addMissing(findings, "V505-FVE-MODULE-REF", "FVE string references missing module.", { index, moduleId: string.moduleId });
    }
    if (string.mpptId && mpptIds.size > 0 && !mpptIds.has(string.mpptId)) {
      addMissing(findings, "V505-FVE-MPPT-REF", "FVE string references missing MPPT.", { index, mpptId: string.mpptId });
    }
  });

  project.fve.mppts.forEach((mppt, index) => {
    if (mppt.inverterId && inverterIds.size > 0 && !inverterIds.has(mppt.inverterId)) {
      addMissing(findings, "V505-FVE-INVERTER-REF", "MPPT references missing inverter.", { index, inverterId: mppt.inverterId });
    }
  });

  project.cad.objects.forEach((object, index) => {
    if (object.layerId && layerIds.size > 0 && !layerIds.has(object.layerId)) {
      addMissing(findings, "V505-CAD-LAYER-REF", "CAD object references missing layer.", { index, layerId: object.layerId });
    }
  });

  const qaSummary = runQaFeed({ findings }).qaSummary;
  return { valid: findings.length === 0, findings, qaSummary };
}
