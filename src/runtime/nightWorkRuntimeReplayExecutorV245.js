// LOSKOT FVE & LPS STUDIO PRO
// V245 night-work-runtime-replay-executor

import { createNightWorkRuntimeReplayPlan, validateNightWorkRuntimeReplayPlan } from './nightWorkRuntimeReplayPlanV244.js';

export const NIGHT_WORK_RUNTIME_REPLAY_EXECUTOR_VERSION = 'v245-night-work-runtime-replay-executor';

export function createNightWorkRuntimeReplayExecutor(options = {}) {
  const previous = createNightWorkRuntimeReplayPlan(options);
  const validation = validateNightWorkRuntimeReplayPlan(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_REPLAY_EXECUTOR_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V245_READY' : 'BLOCKED',
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
      runtimeStep: 245,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_REPLAY_EXECUTOR_VERSION
    }
  };
}

export function validateNightWorkRuntimeReplayExecutor(model = createNightWorkRuntimeReplayExecutor()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_REPLAY_EXECUTOR_VERSION) errors.push('Unexpected V245 version.');
  if (model.visualMutationAllowed !== false) errors.push('V245 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V245 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V245 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V245 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V245 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V245 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
