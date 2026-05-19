// LOSKOT FVE & LPS STUDIO PRO
// V246 night-work-runtime-consistency-model

import { createNightWorkRuntimeReplayExecutor, validateNightWorkRuntimeReplayExecutor } from './nightWorkRuntimeReplayExecutorV245.js';

export const NIGHT_WORK_RUNTIME_CONSISTENCY_MODEL_VERSION = 'v246-night-work-runtime-consistency-model';

export function createNightWorkRuntimeConsistencyModel(options = {}) {
  const previous = createNightWorkRuntimeReplayExecutor(options);
  const validation = validateNightWorkRuntimeReplayExecutor(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_CONSISTENCY_MODEL_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V246_READY' : 'BLOCKED',
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
      runtimeStep: 246,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_CONSISTENCY_MODEL_VERSION
    }
  };
}

export function validateNightWorkRuntimeConsistencyModel(model = createNightWorkRuntimeConsistencyModel()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_CONSISTENCY_MODEL_VERSION) errors.push('Unexpected V246 version.');
  if (model.visualMutationAllowed !== false) errors.push('V246 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V246 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V246 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V246 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V246 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V246 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
