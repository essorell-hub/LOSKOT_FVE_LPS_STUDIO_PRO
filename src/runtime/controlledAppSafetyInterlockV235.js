// LOSKOT FVE & LPS STUDIO PRO
// V235 controlled-app-safety-interlock

import { createControlledAppStateValidator, validateControlledAppStateValidator } from './controlledAppStateValidatorV234.js';

export const CONTROLLED_APP_SAFETY_INTERLOCK_VERSION = 'v235-controlled-app-safety-interlock';

export function createControlledAppSafetyInterlock(options = {}) {
  const previous = createControlledAppStateValidator(options);
  const validation = validateControlledAppStateValidator(previous);
  return {
    modelVersion: CONTROLLED_APP_SAFETY_INTERLOCK_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V235_READY' : 'BLOCKED',
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
      runtimeStep: 235,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_SAFETY_INTERLOCK_VERSION
    }
  };
}

export function validateControlledAppSafetyInterlock(model = createControlledAppSafetyInterlock()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_SAFETY_INTERLOCK_VERSION) errors.push('Unexpected V235 version.');
  if (model.visualMutationAllowed !== false) errors.push('V235 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V235 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V235 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V235 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V235 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V235 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
