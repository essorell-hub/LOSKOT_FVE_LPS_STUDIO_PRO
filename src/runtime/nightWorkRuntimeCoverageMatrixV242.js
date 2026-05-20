// LOSKOT FVE & LPS STUDIO PRO
// V242 night-work-runtime-coverage-matrix

import { createNightWorkRuntimeAuditLedger, validateNightWorkRuntimeAuditLedger } from './nightWorkRuntimeAuditLedgerV241.js';

export const NIGHT_WORK_RUNTIME_COVERAGE_MATRIX_VERSION = 'v242-night-work-runtime-coverage-matrix';

export function createNightWorkRuntimeCoverageMatrix(options = {}) {
  const previous = createNightWorkRuntimeAuditLedger(options);
  const validation = validateNightWorkRuntimeAuditLedger(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_COVERAGE_MATRIX_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V242_READY' : 'BLOCKED',
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
      runtimeStep: 242,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_COVERAGE_MATRIX_VERSION
    }
  };
}

export function validateNightWorkRuntimeCoverageMatrix(model = createNightWorkRuntimeCoverageMatrix()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_COVERAGE_MATRIX_VERSION) errors.push('Unexpected V242 version.');
  if (model.visualMutationAllowed !== false) errors.push('V242 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V242 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V242 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V242 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V242 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V242 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
