// LOSKOT FVE & LPS STUDIO PRO
// V248 night-work-runtime-regression-guard

import { createNightWorkRuntimeQualityScore, validateNightWorkRuntimeQualityScore } from './nightWorkRuntimeQualityScoreV247.js';

export const NIGHT_WORK_RUNTIME_REGRESSION_GUARD_VERSION = 'v248-night-work-runtime-regression-guard';

export function createNightWorkRuntimeRegressionGuard(options = {}) {
  const previous = createNightWorkRuntimeQualityScore(options);
  const validation = validateNightWorkRuntimeQualityScore(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_REGRESSION_GUARD_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V248_READY' : 'BLOCKED',
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
      runtimeStep: 248,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_REGRESSION_GUARD_VERSION
    }
  };
}

export function validateNightWorkRuntimeRegressionGuard(model = createNightWorkRuntimeRegressionGuard()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_REGRESSION_GUARD_VERSION) errors.push('Unexpected V248 version.');
  if (model.visualMutationAllowed !== false) errors.push('V248 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V248 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V248 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V248 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V248 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V248 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
