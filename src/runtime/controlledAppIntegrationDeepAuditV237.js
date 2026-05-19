// LOSKOT FVE & LPS STUDIO PRO
// V237 controlled-app-integration-deep-audit

import { createControlledAppIntegrationDiagnostics, validateControlledAppIntegrationDiagnostics } from './controlledAppIntegrationDiagnosticsV236.js';

export const CONTROLLED_APP_INTEGRATION_DEEP_AUDIT_VERSION = 'v237-controlled-app-integration-deep-audit';

export function createControlledAppIntegrationDeepAudit(options = {}) {
  const previous = createControlledAppIntegrationDiagnostics(options);
  const validation = validateControlledAppIntegrationDiagnostics(previous);
  return {
    modelVersion: CONTROLLED_APP_INTEGRATION_DEEP_AUDIT_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V237_READY' : 'BLOCKED',
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
      runtimeStep: 237,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_INTEGRATION_DEEP_AUDIT_VERSION
    }
  };
}

export function validateControlledAppIntegrationDeepAudit(model = createControlledAppIntegrationDeepAudit()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_INTEGRATION_DEEP_AUDIT_VERSION) errors.push('Unexpected V237 version.');
  if (model.visualMutationAllowed !== false) errors.push('V237 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V237 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V237 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V237 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V237 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V237 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
