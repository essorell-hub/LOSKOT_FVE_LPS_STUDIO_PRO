// LOSKOT FVE & LPS STUDIO PRO
// V238 controlled-app-integration-release-gate

import { createControlledAppIntegrationDeepAudit, validateControlledAppIntegrationDeepAudit } from './controlledAppIntegrationDeepAuditV237.js';

export const CONTROLLED_APP_INTEGRATION_RELEASE_GATE_VERSION = 'v238-controlled-app-integration-release-gate';

export function createControlledAppIntegrationReleaseGate(options = {}) {
  const previous = createControlledAppIntegrationDeepAudit(options);
  const validation = validateControlledAppIntegrationDeepAudit(previous);
  return {
    modelVersion: CONTROLLED_APP_INTEGRATION_RELEASE_GATE_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V238_READY' : 'BLOCKED',
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
      runtimeStep: 238,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_INTEGRATION_RELEASE_GATE_VERSION
    }
  };
}

export function validateControlledAppIntegrationReleaseGate(model = createControlledAppIntegrationReleaseGate()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_INTEGRATION_RELEASE_GATE_VERSION) errors.push('Unexpected V238 version.');
  if (model.visualMutationAllowed !== false) errors.push('V238 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V238 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V238 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V238 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V238 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V238 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
