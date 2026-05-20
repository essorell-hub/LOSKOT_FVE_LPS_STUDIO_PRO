// LOSKOT FVE & LPS STUDIO PRO
// V234 controlled-app-state-validator

import { createControlledAppStateSnapshot, validateControlledAppStateSnapshot } from './controlledAppStateSnapshotV233.js';

export const CONTROLLED_APP_STATE_VALIDATOR_VERSION = 'v234-controlled-app-state-validator';

export function createControlledAppStateValidator(options = {}) {
  const previous = createControlledAppStateSnapshot(options);
  const validation = validateControlledAppStateSnapshot(previous);
  return {
    modelVersion: CONTROLLED_APP_STATE_VALIDATOR_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V234_READY' : 'BLOCKED',
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
      runtimeStep: 234,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_STATE_VALIDATOR_VERSION
    }
  };
}

export function validateControlledAppStateValidator(model = createControlledAppStateValidator()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_STATE_VALIDATOR_VERSION) errors.push('Unexpected V234 version.');
  if (model.visualMutationAllowed !== false) errors.push('V234 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V234 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V234 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V234 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V234 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V234 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
