// LOSKOT FVE & LPS STUDIO PRO
// V259 night-work-runtime-readiness-gate

import { createNightWorkRuntimeFinalAudit, validateNightWorkRuntimeFinalAudit } from './nightWorkRuntimeFinalAuditV258.js';

export const NIGHT_WORK_RUNTIME_READINESS_GATE_VERSION = 'v259-night-work-runtime-readiness-gate';

export function createNightWorkRuntimeReadinessGate(options = {}) {
  const previous = createNightWorkRuntimeFinalAudit(options);
  const validation = validateNightWorkRuntimeFinalAudit(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_READINESS_GATE_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V259_READY' : 'BLOCKED',
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
      runtimeStep: 259,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_READINESS_GATE_VERSION
    }
  };
}

export function validateNightWorkRuntimeReadinessGate(model = createNightWorkRuntimeReadinessGate()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_READINESS_GATE_VERSION) errors.push('Unexpected V259 version.');
  if (model.visualMutationAllowed !== false) errors.push('V259 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V259 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V259 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V259 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V259 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V259 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
