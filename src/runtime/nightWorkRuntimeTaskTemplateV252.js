// LOSKOT FVE & LPS STUDIO PRO
// V252 night-work-runtime-task-template

import { createNightWorkRuntimeQueueContract, validateNightWorkRuntimeQueueContract } from './nightWorkRuntimeQueueContractV251.js';

export const NIGHT_WORK_RUNTIME_TASK_TEMPLATE_VERSION = 'v252-night-work-runtime-task-template';

export function createNightWorkRuntimeTaskTemplate(options = {}) {
  const previous = createNightWorkRuntimeQueueContract(options);
  const validation = validateNightWorkRuntimeQueueContract(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_TASK_TEMPLATE_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V252_READY' : 'BLOCKED',
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
      runtimeStep: 252,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_TASK_TEMPLATE_VERSION
    }
  };
}

export function validateNightWorkRuntimeTaskTemplate(model = createNightWorkRuntimeTaskTemplate()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_TASK_TEMPLATE_VERSION) errors.push('Unexpected V252 version.');
  if (model.visualMutationAllowed !== false) errors.push('V252 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V252 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V252 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V252 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V252 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V252 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
