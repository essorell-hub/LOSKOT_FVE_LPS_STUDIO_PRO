// POST-MEGA AUTOPILOT D
// Layer visibility read-only runtime bridge.

import { safeGetProjectModel, getVisibleLayerNames, POST_MEGA_PROJECT_MODEL_VERSION } from "../core/postMega/projectModelAdapter.mjs";

export const POST_MEGA_LAYER_VISIBILITY_BRIDGE_VERSION = "post-mega-autopilot-d";

export function getRuntimeLayerVisibilityMatrix(source = {}) {
  const model = safeGetProjectModel(source);
  const visible = getVisibleLayerNames(model);
  const matrix = {};
  for (const [name, value] of Object.entries(model.layers || {})) {
    matrix[name] = { visible: Boolean(value), listed: visible.includes(name) };
  }
  return { version: POST_MEGA_LAYER_VISIBILITY_BRIDGE_VERSION, modelVersion: POST_MEGA_PROJECT_MODEL_VERSION, visibleLayers: visible, matrix };
}

export function isRuntimeLayerVisible(source = {}, layerName = "") {
  return getRuntimeLayerVisibilityMatrix(source).visibleLayers.includes(layerName);
}

export function installPostMegaLayerVisibilityBridge(root = globalThis) {
  if (!root) return null;
  if (root.LOSKOT_POST_MEGA_LAYER_VISIBILITY_BRIDGE) return root.LOSKOT_POST_MEGA_LAYER_VISIBILITY_BRIDGE;
  const api = { version: POST_MEGA_LAYER_VISIBILITY_BRIDGE_VERSION, getRuntimeLayerVisibilityMatrix, isRuntimeLayerVisible };
  root.LOSKOT_POST_MEGA_LAYER_VISIBILITY_BRIDGE = api;
  return api;
}

installPostMegaLayerVisibilityBridge();
