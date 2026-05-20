// LOSKOT FVE & LPS STUDIO PRO
// V244 night-work-runtime-replay-plan

import { createNightWorkRuntimeDriftDetector, validateNightWorkRuntimeDriftDetector } from './nightWorkRuntimeDriftDetectorV243.js';

export const NIGHT_WORK_RUNTIME_REPLAY_PLAN_VERSION = 'v244-night-work-runtime-replay-plan';

export function createNightWorkRuntimeReplayPlan(options = {}) {
  const previous = createNightWorkRuntimeDriftDetector(options);
  const validation = validateNightWorkRuntimeDriftDetector(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_REPLAY_PLAN_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V244_READY' : 'BLOCKED',
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
      runtimeStep: 244,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_REPLAY_PLAN_VERSION
    }
  };
}

export function validateNightWorkRuntimeReplayPlan(model = createNightWorkRuntimeReplayPlan()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_REPLAY_PLAN_VERSION) errors.push('Unexpected V244 version.');
  if (model.visualMutationAllowed !== false) errors.push('V244 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V244 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V244 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V244 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V244 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V244 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
