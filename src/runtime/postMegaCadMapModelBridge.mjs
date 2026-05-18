// POST-MEGA AUTOPILOT C
// CAD/MAPA read-only runtime snapshot bridge.

import { safeGetProjectModel, getVisibleLayerNames, POST_MEGA_PROJECT_MODEL_VERSION } from "../core/postMega/projectModelAdapter.mjs";

export const POST_MEGA_CAD_MAP_BRIDGE_VERSION = "post-mega-autopilot-c";

export function createCadMapRuntimeSnapshot(source = {}) {
  const model = safeGetProjectModel(source);
  const layers = getVisibleLayerNames(model);
  return {
    version: POST_MEGA_CAD_MAP_BRIDGE_VERSION,
    modelVersion: POST_MEGA_PROJECT_MODEL_VERSION,
    visibleLayers: layers,
    cadMap: model.cadMap || {},
    building: model.building || {},
    roof: model.roof || {},
    fvePanelCount: Array.isArray(model.fve?.panels) ? model.fve.panels.length : 0,
    lpsObjectCount: Array.isArray(model.lps?.objects) ? model.lps.objects.length : 0,
    safeMode: Boolean(model.uiRuntime?.safeMode)
  };
}

export function installPostMegaCadMapModelBridge(root = globalThis) {
  if (!root) return null;
  if (root.LOSKOT_POST_MEGA_CAD_MAP_MODEL_BRIDGE) return root.LOSKOT_POST_MEGA_CAD_MAP_MODEL_BRIDGE;
  const api = { version: POST_MEGA_CAD_MAP_BRIDGE_VERSION, createCadMapRuntimeSnapshot };
  root.LOSKOT_POST_MEGA_CAD_MAP_MODEL_BRIDGE = api;
  return api;
}

installPostMegaCadMapModelBridge();
