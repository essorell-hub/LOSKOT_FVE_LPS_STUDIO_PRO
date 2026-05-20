// LOSKOT FVE & LPS STUDIO PRO
// V243 night-work-runtime-drift-detector

import { createNightWorkRuntimeCoverageMatrix, validateNightWorkRuntimeCoverageMatrix } from './nightWorkRuntimeCoverageMatrixV242.js';

export const NIGHT_WORK_RUNTIME_DRIFT_DETECTOR_VERSION = 'v243-night-work-runtime-drift-detector';

export function createNightWorkRuntimeDriftDetector(options = {}) {
  const previous = createNightWorkRuntimeCoverageMatrix(options);
  const validation = validateNightWorkRuntimeCoverageMatrix(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_DRIFT_DETECTOR_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V243_READY' : 'BLOCKED',
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
      runtimeStep: 243,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_DRIFT_DETECTOR_VERSION
    }
  };
}

export function validateNightWorkRuntimeDriftDetector(model = createNightWorkRuntimeDriftDetector()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_DRIFT_DETECTOR_VERSION) errors.push('Unexpected V243 version.');
  if (model.visualMutationAllowed !== false) errors.push('V243 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V243 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V243 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V243 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V243 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V243 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
