// LOSKOT FVE & LPS STUDIO PRO
// V256 night-work-runtime-no-visual-policy

import { createNightWorkRuntimeNoPushPolicy, validateNightWorkRuntimeNoPushPolicy } from './nightWorkRuntimeNoPushPolicyV255.js';

export const NIGHT_WORK_RUNTIME_NO_VISUAL_POLICY_VERSION = 'v256-night-work-runtime-no-visual-policy';

export function createNightWorkRuntimeNoVisualPolicy(options = {}) {
  const previous = createNightWorkRuntimeNoPushPolicy(options);
  const validation = validateNightWorkRuntimeNoPushPolicy(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_NO_VISUAL_POLICY_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V256_READY' : 'BLOCKED',
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
      runtimeStep: 256,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_NO_VISUAL_POLICY_VERSION
    }
  };
}

export function validateNightWorkRuntimeNoVisualPolicy(model = createNightWorkRuntimeNoVisualPolicy()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_NO_VISUAL_POLICY_VERSION) errors.push('Unexpected V256 version.');
  if (model.visualMutationAllowed !== false) errors.push('V256 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V256 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V256 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V256 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V256 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V256 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
