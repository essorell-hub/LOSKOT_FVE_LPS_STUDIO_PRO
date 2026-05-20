// LOSKOT FVE & LPS STUDIO PRO
// V255 night-work-runtime-no-push-policy

import { createNightWorkRuntimeRecoveryPlan, validateNightWorkRuntimeRecoveryPlan } from './nightWorkRuntimeRecoveryPlanV254.js';

export const NIGHT_WORK_RUNTIME_NO_PUSH_POLICY_VERSION = 'v255-night-work-runtime-no-push-policy';

export function createNightWorkRuntimeNoPushPolicy(options = {}) {
  const previous = createNightWorkRuntimeRecoveryPlan(options);
  const validation = validateNightWorkRuntimeRecoveryPlan(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_NO_PUSH_POLICY_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V255_READY' : 'BLOCKED',
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
      runtimeStep: 255,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_NO_PUSH_POLICY_VERSION
    }
  };
}

export function validateNightWorkRuntimeNoPushPolicy(model = createNightWorkRuntimeNoPushPolicy()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_NO_PUSH_POLICY_VERSION) errors.push('Unexpected V255 version.');
  if (model.visualMutationAllowed !== false) errors.push('V255 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V255 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V255 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V255 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V255 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V255 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
