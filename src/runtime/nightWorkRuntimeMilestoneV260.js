// LOSKOT FVE & LPS STUDIO PRO
// V260 night-work-runtime-milestone

import { createNightWorkRuntimeReadinessGate, validateNightWorkRuntimeReadinessGate } from './nightWorkRuntimeReadinessGateV259.js';

export const NIGHT_WORK_RUNTIME_MILESTONE_VERSION = 'v260-night-work-runtime-milestone';

export function createNightWorkRuntimeMilestone(options = {}) {
  const previous = createNightWorkRuntimeReadinessGate(options);
  const validation = validateNightWorkRuntimeReadinessGate(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_MILESTONE_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'READY_FOR_NIGHT_SUPERVISED_APP_INTEGRATION' : 'BLOCKED',
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
      runtimeStep: 260,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_MILESTONE_VERSION
    }
  };
}

export function validateNightWorkRuntimeMilestone(model = createNightWorkRuntimeMilestone()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_MILESTONE_VERSION) errors.push('Unexpected V260 version.');
  if (model.visualMutationAllowed !== false) errors.push('V260 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V260 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V260 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V260 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V260 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V260 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
