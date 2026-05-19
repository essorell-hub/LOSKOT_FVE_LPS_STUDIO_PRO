// LOSKOT FVE & LPS STUDIO PRO
// V240 controlled-app-integration-milestone

import { createControlledAppIntegrationWorkQueue, validateControlledAppIntegrationWorkQueue } from './controlledAppIntegrationWorkQueueV239.js';

export const CONTROLLED_APP_INTEGRATION_MILESTONE_VERSION = 'v240-controlled-app-integration-milestone';

export function createControlledAppIntegrationMilestone(options = {}) {
  const previous = createControlledAppIntegrationWorkQueue(options);
  const validation = validateControlledAppIntegrationWorkQueue(previous);
  return {
    modelVersion: CONTROLLED_APP_INTEGRATION_MILESTONE_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V240_READY' : 'BLOCKED',
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
      runtimeStep: 240,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_INTEGRATION_MILESTONE_VERSION
    }
  };
}

export function validateControlledAppIntegrationMilestone(model = createControlledAppIntegrationMilestone()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_INTEGRATION_MILESTONE_VERSION) errors.push('Unexpected V240 version.');
  if (model.visualMutationAllowed !== false) errors.push('V240 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V240 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V240 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V240 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V240 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V240 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
