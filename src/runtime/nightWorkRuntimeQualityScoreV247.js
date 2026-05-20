// LOSKOT FVE & LPS STUDIO PRO
// V247 night-work-runtime-quality-score

import { createNightWorkRuntimeConsistencyModel, validateNightWorkRuntimeConsistencyModel } from './nightWorkRuntimeConsistencyModelV246.js';

export const NIGHT_WORK_RUNTIME_QUALITY_SCORE_VERSION = 'v247-night-work-runtime-quality-score';

export function createNightWorkRuntimeQualityScore(options = {}) {
  const previous = createNightWorkRuntimeConsistencyModel(options);
  const validation = validateNightWorkRuntimeConsistencyModel(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_QUALITY_SCORE_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V247_READY' : 'BLOCKED',
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
      runtimeStep: 247,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_QUALITY_SCORE_VERSION
    }
  };
}

export function validateNightWorkRuntimeQualityScore(model = createNightWorkRuntimeQualityScore()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_QUALITY_SCORE_VERSION) errors.push('Unexpected V247 version.');
  if (model.visualMutationAllowed !== false) errors.push('V247 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V247 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V247 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V247 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V247 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V247 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
