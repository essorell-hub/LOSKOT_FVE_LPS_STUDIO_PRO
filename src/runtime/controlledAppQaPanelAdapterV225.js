// LOSKOT FVE & LPS STUDIO PRO
// V225 controlled-app-qa-panel-adapter

import { createControlledAppWorkspaceAdapter, validateControlledAppWorkspaceAdapter } from './controlledAppWorkspaceAdapterV224.js';

export const CONTROLLED_APP_QA_PANEL_ADAPTER_VERSION = 'v225-controlled-app-qa-panel-adapter';

export function createControlledAppQaPanelAdapter(options = {}) {
  const previous = createControlledAppWorkspaceAdapter(options);
  const validation = validateControlledAppWorkspaceAdapter(previous);
  return {
    modelVersion: CONTROLLED_APP_QA_PANEL_ADAPTER_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V225_READY' : 'BLOCKED',
    visualMutationAllowed: false,
    controls: {
      readOnly: true,
      canWriteUi: false,
      canMutateVisuals: false,
      canPush: false,
      canMerge: false,
      canChangePackage: false
    },
    metrics: {
      runtimeStep: 225,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_QA_PANEL_ADAPTER_VERSION
    }
  };
}

export function validateControlledAppQaPanelAdapter(model = createControlledAppQaPanelAdapter()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_QA_PANEL_ADAPTER_VERSION) errors.push('Unexpected V225 version.');
  if (model.visualMutationAllowed !== false) errors.push('V225 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V225 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V225 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V225 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V225 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V225 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
