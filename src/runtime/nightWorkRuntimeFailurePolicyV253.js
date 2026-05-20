// LOSKOT FVE & LPS STUDIO PRO
// V253 night-work-runtime-failure-policy

import { createNightWorkRuntimeTaskTemplate, validateNightWorkRuntimeTaskTemplate } from './nightWorkRuntimeTaskTemplateV252.js';

export const NIGHT_WORK_RUNTIME_FAILURE_POLICY_VERSION = 'v253-night-work-runtime-failure-policy';

export function createNightWorkRuntimeFailurePolicy(options = {}) {
  const previous = createNightWorkRuntimeTaskTemplate(options);
  const validation = validateNightWorkRuntimeTaskTemplate(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_FAILURE_POLICY_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V253_READY' : 'BLOCKED',
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
      runtimeStep: 253,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_FAILURE_POLICY_VERSION
    }
  };
}

export function validateNightWorkRuntimeFailurePolicy(model = createNightWorkRuntimeFailurePolicy()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_FAILURE_POLICY_VERSION) errors.push('Unexpected V253 version.');
  if (model.visualMutationAllowed !== false) errors.push('V253 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V253 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V253 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V253 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V253 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V253 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
