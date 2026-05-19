// LOSKOT FVE & LPS STUDIO PRO
// V241 night-work-runtime-audit-ledger

import { createControlledAppIntegrationMilestone, validateControlledAppIntegrationMilestone } from './controlledAppIntegrationMilestoneV240.js';

export const NIGHT_WORK_RUNTIME_AUDIT_LEDGER_VERSION = 'v241-night-work-runtime-audit-ledger';

export function createNightWorkRuntimeAuditLedger(options = {}) {
  const previous = createControlledAppIntegrationMilestone(options);
  const validation = validateControlledAppIntegrationMilestone(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_AUDIT_LEDGER_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V241_READY' : 'BLOCKED',
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
      runtimeStep: 241,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_AUDIT_LEDGER_VERSION
    }
  };
}

export function validateNightWorkRuntimeAuditLedger(model = createNightWorkRuntimeAuditLedger()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_AUDIT_LEDGER_VERSION) errors.push('Unexpected V241 version.');
  if (model.visualMutationAllowed !== false) errors.push('V241 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V241 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V241 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V241 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V241 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V241 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
