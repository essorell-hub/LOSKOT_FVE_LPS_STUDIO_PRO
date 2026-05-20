// LOSKOT FVE & LPS STUDIO PRO
// V236 controlled-app-integration-diagnostics

import { createControlledAppSafetyInterlock, validateControlledAppSafetyInterlock } from './controlledAppSafetyInterlockV235.js';

export const CONTROLLED_APP_INTEGRATION_DIAGNOSTICS_VERSION = 'v236-controlled-app-integration-diagnostics';

export function createControlledAppIntegrationDiagnostics(options = {}) {
  const previous = createControlledAppSafetyInterlock(options);
  const validation = validateControlledAppSafetyInterlock(previous);
  return {
    modelVersion: CONTROLLED_APP_INTEGRATION_DIAGNOSTICS_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V236_READY' : 'BLOCKED',
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
      runtimeStep: 236,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_INTEGRATION_DIAGNOSTICS_VERSION
    }
  };
}

export function validateControlledAppIntegrationDiagnostics(model = createControlledAppIntegrationDiagnostics()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_INTEGRATION_DIAGNOSTICS_VERSION) errors.push('Unexpected V236 version.');
  if (model.visualMutationAllowed !== false) errors.push('V236 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V236 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V236 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V236 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V236 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V236 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
