// POST-MEGA AUTOPILOT E
// Runtime QA snapshot bridge for project model health.

import { safeGetProjectModel, getVisibleLayerNames, POST_MEGA_PROJECT_MODEL_VERSION } from "../core/postMega/projectModelAdapter.mjs";

export const POST_MEGA_RUNTIME_QA_BRIDGE_VERSION = "post-mega-autopilot-e";

export function createRuntimeQaSnapshot(source = {}) {
  const model = safeGetProjectModel(source);
  const visibleLayers = getVisibleLayerNames(model);
  const warnings = [];
  if (!model.meta?.id) warnings.push("missing_project_id");
  if (!model.uiRuntime?.safeMode) warnings.push("safe_mode_disabled");
  return {
    version: POST_MEGA_RUNTIME_QA_BRIDGE_VERSION,
    modelVersion: POST_MEGA_PROJECT_MODEL_VERSION,
    safeMode: Boolean(model.uiRuntime?.safeMode),
    visibleLayers,
    counts: {
      fvePanels: Array.isArray(model.fve?.panels) ? model.fve.panels.length : 0,
      lpsObjects: Array.isArray(model.lps?.objects) ? model.lps.objects.length : 0,
      documents: Array.isArray(model.documents?.items) ? model.documents.items.length : 0
    },
    warnings
  };
}

export function installPostMegaRuntimeQaSnapshotBridge(root = globalThis) {
  if (!root) return null;
  if (root.LOSKOT_POST_MEGA_RUNTIME_QA_SNAPSHOT_BRIDGE) return root.LOSKOT_POST_MEGA_RUNTIME_QA_SNAPSHOT_BRIDGE;
  const api = { version: POST_MEGA_RUNTIME_QA_BRIDGE_VERSION, createRuntimeQaSnapshot };
  root.LOSKOT_POST_MEGA_RUNTIME_QA_SNAPSHOT_BRIDGE = api;
  return api;
}

installPostMegaRuntimeQaSnapshotBridge();
