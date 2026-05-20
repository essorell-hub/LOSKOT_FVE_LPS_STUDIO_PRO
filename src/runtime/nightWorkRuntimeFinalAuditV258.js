// LOSKOT FVE & LPS STUDIO PRO
// V258 night-work-runtime-final-audit

import { createNightWorkRuntimePackageGuard, validateNightWorkRuntimePackageGuard } from './nightWorkRuntimePackageGuardV257.js';

export const NIGHT_WORK_RUNTIME_FINAL_AUDIT_VERSION = 'v258-night-work-runtime-final-audit';

export function createNightWorkRuntimeFinalAudit(options = {}) {
  const previous = createNightWorkRuntimePackageGuard(options);
  const validation = validateNightWorkRuntimePackageGuard(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_FINAL_AUDIT_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V258_READY' : 'BLOCKED',
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
      runtimeStep: 258,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_FINAL_AUDIT_VERSION
    }
  };
}

export function validateNightWorkRuntimeFinalAudit(model = createNightWorkRuntimeFinalAudit()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_FINAL_AUDIT_VERSION) errors.push('Unexpected V258 version.');
  if (model.visualMutationAllowed !== false) errors.push('V258 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V258 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V258 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V258 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V258 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V258 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
