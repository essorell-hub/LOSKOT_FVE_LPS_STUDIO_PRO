// LOSKOT FVE & LPS STUDIO PRO
// V224 controlled-app-workspace-adapter

import { createControlledAppNavigationAdapter, validateControlledAppNavigationAdapter } from './controlledAppNavigationAdapterV223.js';

export const CONTROLLED_APP_WORKSPACE_ADAPTER_VERSION = 'v224-controlled-app-workspace-adapter';

export function createControlledAppWorkspaceAdapter(options = {}) {
  const previous = createControlledAppNavigationAdapter(options);
  const validation = validateControlledAppNavigationAdapter(previous);
  return {
    modelVersion: CONTROLLED_APP_WORKSPACE_ADAPTER_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V224_READY' : 'BLOCKED',
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
      runtimeStep: 224,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_WORKSPACE_ADAPTER_VERSION
    }
  };
}

export function validateControlledAppWorkspaceAdapter(model = createControlledAppWorkspaceAdapter()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_WORKSPACE_ADAPTER_VERSION) errors.push('Unexpected V224 version.');
  if (model.visualMutationAllowed !== false) errors.push('V224 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V224 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V224 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V224 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V224 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V224 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
