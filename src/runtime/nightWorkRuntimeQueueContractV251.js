// LOSKOT FVE & LPS STUDIO PRO
// V251 night-work-runtime-queue-contract

import { createNightWorkRuntimeSupervisorBridge, validateNightWorkRuntimeSupervisorBridge } from './nightWorkRuntimeSupervisorBridgeV250.js';

export const NIGHT_WORK_RUNTIME_QUEUE_CONTRACT_VERSION = 'v251-night-work-runtime-queue-contract';

export function createNightWorkRuntimeQueueContract(options = {}) {
  const previous = createNightWorkRuntimeSupervisorBridge(options);
  const validation = validateNightWorkRuntimeSupervisorBridge(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_QUEUE_CONTRACT_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V251_READY' : 'BLOCKED',
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
      runtimeStep: 251,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_QUEUE_CONTRACT_VERSION
    }
  };
}

export function validateNightWorkRuntimeQueueContract(model = createNightWorkRuntimeQueueContract()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_QUEUE_CONTRACT_VERSION) errors.push('Unexpected V251 version.');
  if (model.visualMutationAllowed !== false) errors.push('V251 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V251 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V251 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V251 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V251 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V251 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
