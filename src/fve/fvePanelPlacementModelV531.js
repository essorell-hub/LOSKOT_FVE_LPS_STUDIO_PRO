import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { createQaFinding, runQaFeed } from "../validation/qaFeedEngine.js";

function panelId(panel, index) {
  return panel.panelId || panel.id || `panel-${index + 1}`;
}

function hasPositivePower(panel, modules) {
  const directPower = Number(panel.powerWp || panel.powerW || panel.power);
  if (Number.isFinite(directPower) && directPower > 0) return true;
  const modelId = panel.moduleId || panel.modelId || panel.moduleModel;
  return Boolean(modelId && modules.some((module) => [module.moduleId, module.id, module.model].includes(modelId)));
}

function hasKnownPlacement(panel, project) {
  const roofIds = new Set(project.roof.planes.map((plane) => plane.id || plane.roofPlaneId).filter(Boolean));
  if (panel.roofPlaneId && roofIds.has(panel.roofPlaneId)) return true;
  if (panel.roofId && (panel.roofId === project.roof.roofId || roofIds.has(panel.roofId))) return true;
  const layerIds = new Set(project.cad.layers.map((layer) => layer.layerId || layer.id).filter(Boolean));
  if (panel.layerId && layerIds.has(panel.layerId)) return true;
  return Boolean(panel.placementPending);
}

export function normalizeFvePanelPlacements(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const panels = project.fve.panels.map((panel, index) => ({
    panelId: panelId(panel, index),
    moduleId: panel.moduleId || panel.modelId || panel.moduleModel || null,
    roofPlaneId: panel.roofPlaneId || panel.roofId || null,
    layerId: panel.layerId || null,
    x: Number(panel.x || 0),
    y: Number(panel.y || 0),
    rotationDeg: Number(panel.rotationDeg || panel.rotation || 0),
    powerWp: Number(panel.powerWp || panel.powerW || panel.power || 0),
    placementPending: panel.placementPending === true,
    source: panel,
  }));

  return {
    panels,
    qaFindings: evaluateFvePanelPlacementQa({ ...project, fve: { ...project.fve, panels } }),
  };
}

export function evaluateFvePanelPlacementQa(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const findings = [];

  project.fve.panels.forEach((panel, index) => {
    if (!hasPositivePower(panel, project.fve.modules)) {
      findings.push(createQaFinding("FVE-PANEL-001", "ERROR", "Panel must have positive power or a valid module model.", {
        source: "FVE_PANEL_PLACEMENT_V531",
        panelId: panelId(panel, index),
      }));
    }
    if (!hasKnownPlacement(panel, project)) {
      findings.push(createQaFinding("FVE-PANEL-002", "WARN", "Panel must be placed on an existing roof plane or CAD layer.", {
        source: "FVE_PANEL_PLACEMENT_V531",
        panelId: panelId(panel, index),
      }));
    }
  });

  return findings;
}

export function createFvePanelPlacementSummary(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const evaluation = normalizeFvePanelPlacements(project);
  const feed = runQaFeed({ fveFindings: evaluation.qaFindings, project });

  return {
    panelCount: evaluation.panels.length,
    placedCount: evaluation.panels.filter((panel) => !panel.placementPending).length,
    pendingCount: evaluation.panels.filter((panel) => panel.placementPending).length,
    panels: evaluation.panels,
    qaFindings: feed.qaFindings,
    qaSummary: feed.qaSummary,
  };
}
