// POST-MEGA V4 NIGHT FACTORY
// Runtime health snapshot bridge.

import { safeGetProjectModel, getVisibleLayerNames } from "../core/postMega/projectModelAdapter.mjs";

export const POST_MEGA_RUNTIME_HEALTH_VERSION = "post-mega-v4-runtime-health-1";

export function createRuntimeHealthSnapshot(source = {}) {
  const model = safeGetProjectModel(source);
  const visibleLayers = getVisibleLayerNames(model);
  const findings = [];

  if (!model.uiRuntime?.safeMode) findings.push("safe_mode_disabled");
  if (visibleLayers.length === 0) findings.push("no_visible_layers");
  if (!model.meta) findings.push("missing_meta");
  if (!model.cadMap) findings.push("missing_cad_map_model");

  return {
    version: POST_MEGA_RUNTIME_HEALTH_VERSION,
    ok: findings.length === 0,
    findings,
    visibleLayers,
    counts: {
      fvePanels: Array.isArray(model.fve?.panels) ? model.fve.panels.length : 0,
      lpsObjects: Array.isArray(model.lps?.objects) ? model.lps.objects.length : 0,
      documents: Array.isArray(model.documents?.items) ? model.documents.items.length : 0
    }
  };
}

export function assertRuntimeHealth(source = {}) {
  const snapshot = createRuntimeHealthSnapshot(source);
  return { ok: snapshot.ok, findings: snapshot.findings };
}
