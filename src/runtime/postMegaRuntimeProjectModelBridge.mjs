// POST-MEGA AUTOPILOT B3
// ESM read-only runtime bridge for the guarded project model adapter.
// This file must not mutate DOM, CSS, Classic PRO layout or CAD/MAPA geometry.

import {
  createEmptyProjectModel,
  safeGetProjectModel,
  getVisibleLayerNames,
  POST_MEGA_PROJECT_MODEL_VERSION
} from "../core/postMega/projectModelAdapter.mjs";

export const POST_MEGA_RUNTIME_BRIDGE_VERSION = "post-mega-autopilot-b3";

export function normalizeRuntimeProjectModel(source) {
  return safeGetProjectModel(source);
}

export function createRuntimeProjectModel(overrides = {}) {
  return createEmptyProjectModel(overrides);
}

export function getRuntimeVisibleLayers(source) {
  const model = safeGetProjectModel(source || {});
  return getVisibleLayerNames(model);
}

export function installPostMegaRuntimeProjectModelBridge(root = globalThis) {
  if (!root) return null;
  if (root.LOSKOT_POST_MEGA_RUNTIME_PROJECT_MODEL_BRIDGE) {
    return root.LOSKOT_POST_MEGA_RUNTIME_PROJECT_MODEL_BRIDGE;
  }
  const api = {
    version: POST_MEGA_RUNTIME_BRIDGE_VERSION,
    modelVersion: POST_MEGA_PROJECT_MODEL_VERSION,
    normalizeRuntimeProjectModel,
    createRuntimeProjectModel,
    getRuntimeVisibleLayers
  };
  root.LOSKOT_POST_MEGA_RUNTIME_PROJECT_MODEL_BRIDGE = api;
  return api;
}

installPostMegaRuntimeProjectModelBridge();
