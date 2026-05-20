// LOSKOT FVE & LPS STUDIO PRO
// V257 night-work-runtime-package-guard

import { createNightWorkRuntimeNoVisualPolicy, validateNightWorkRuntimeNoVisualPolicy } from './nightWorkRuntimeNoVisualPolicyV256.js';

export const NIGHT_WORK_RUNTIME_PACKAGE_GUARD_VERSION = 'v257-night-work-runtime-package-guard';

export function createNightWorkRuntimePackageGuard(options = {}) {
  const previous = createNightWorkRuntimeNoVisualPolicy(options);
  const validation = validateNightWorkRuntimeNoVisualPolicy(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_PACKAGE_GUARD_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V257_READY' : 'BLOCKED',
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
      runtimeStep: 257,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_PACKAGE_GUARD_VERSION
    }
  };
}

export function validateNightWorkRuntimePackageGuard(model = createNightWorkRuntimePackageGuard()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_PACKAGE_GUARD_VERSION) errors.push('Unexpected V257 version.');
  if (model.visualMutationAllowed !== false) errors.push('V257 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V257 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V257 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V257 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V257 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V257 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
