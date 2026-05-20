// LOSKOT FVE & LPS STUDIO PRO
// V221 controlled-app-integration-bridge

import { createVisibleShellAttachmentMilestone, validateVisibleShellAttachmentMilestone } from './visibleShellAttachmentMilestoneV220.js';

export const CONTROLLED_APP_INTEGRATION_BRIDGE_VERSION = 'v221-controlled-app-integration-bridge';

export function createControlledAppIntegrationBridge(options = {}) {
  const source = createVisibleShellAttachmentMilestone(options);
  const validation = validateVisibleShellAttachmentMilestone(source);
  return {
    modelVersion: CONTROLLED_APP_INTEGRATION_BRIDGE_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V221_READY' : 'BLOCKED',
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
      runtimeStep: 221,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    source,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_INTEGRATION_BRIDGE_VERSION
    }
  };
}

export function validateControlledAppIntegrationBridge(model = createControlledAppIntegrationBridge()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_INTEGRATION_BRIDGE_VERSION) errors.push('Unexpected V221 version.');
  if (model.visualMutationAllowed !== false) errors.push('V221 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V221 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V221 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V221 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V221 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V221 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
