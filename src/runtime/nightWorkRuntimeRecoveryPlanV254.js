// LOSKOT FVE & LPS STUDIO PRO
// V254 night-work-runtime-recovery-plan

import { createNightWorkRuntimeFailurePolicy, validateNightWorkRuntimeFailurePolicy } from './nightWorkRuntimeFailurePolicyV253.js';

export const NIGHT_WORK_RUNTIME_RECOVERY_PLAN_VERSION = 'v254-night-work-runtime-recovery-plan';

export function createNightWorkRuntimeRecoveryPlan(options = {}) {
  const previous = createNightWorkRuntimeFailurePolicy(options);
  const validation = validateNightWorkRuntimeFailurePolicy(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_RECOVERY_PLAN_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V254_READY' : 'BLOCKED',
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
      runtimeStep: 254,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_RECOVERY_PLAN_VERSION
    }
  };
}

export function validateNightWorkRuntimeRecoveryPlan(model = createNightWorkRuntimeRecoveryPlan()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_RECOVERY_PLAN_VERSION) errors.push('Unexpected V254 version.');
  if (model.visualMutationAllowed !== false) errors.push('V254 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V254 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V254 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V254 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V254 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V254 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
