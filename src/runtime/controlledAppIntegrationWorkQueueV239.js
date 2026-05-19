// LOSKOT FVE & LPS STUDIO PRO
// V239 controlled-app-integration-work-queue

import { createControlledAppIntegrationReleaseGate, validateControlledAppIntegrationReleaseGate } from './controlledAppIntegrationReleaseGateV238.js';

export const CONTROLLED_APP_INTEGRATION_WORK_QUEUE_VERSION = 'v239-controlled-app-integration-work-queue';

export function createControlledAppIntegrationWorkQueue(options = {}) {
  const previous = createControlledAppIntegrationReleaseGate(options);
  const validation = validateControlledAppIntegrationReleaseGate(previous);
  return {
    modelVersion: CONTROLLED_APP_INTEGRATION_WORK_QUEUE_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V239_READY' : 'BLOCKED',
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
      runtimeStep: 239,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_INTEGRATION_WORK_QUEUE_VERSION
    }
  };
}

export function validateControlledAppIntegrationWorkQueue(model = createControlledAppIntegrationWorkQueue()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_INTEGRATION_WORK_QUEUE_VERSION) errors.push('Unexpected V239 version.');
  if (model.visualMutationAllowed !== false) errors.push('V239 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V239 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V239 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V239 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V239 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V239 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
