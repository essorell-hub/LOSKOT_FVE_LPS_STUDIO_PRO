// LOSKOT FVE & LPS STUDIO PRO
// V250 night-work-runtime-supervisor-bridge

import { createNightWorkRuntimeSnapshotExporter, validateNightWorkRuntimeSnapshotExporter } from './nightWorkRuntimeSnapshotExporterV249.js';

export const NIGHT_WORK_RUNTIME_SUPERVISOR_BRIDGE_VERSION = 'v250-night-work-runtime-supervisor-bridge';

export function createNightWorkRuntimeSupervisorBridge(options = {}) {
  const previous = createNightWorkRuntimeSnapshotExporter(options);
  const validation = validateNightWorkRuntimeSnapshotExporter(previous);
  return {
    modelVersion: NIGHT_WORK_RUNTIME_SUPERVISOR_BRIDGE_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V250_READY' : 'BLOCKED',
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
      runtimeStep: 250,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: NIGHT_WORK_RUNTIME_SUPERVISOR_BRIDGE_VERSION
    }
  };
}

export function validateNightWorkRuntimeSupervisorBridge(model = createNightWorkRuntimeSupervisorBridge()) {
  const errors = [];
  if (model.modelVersion !== NIGHT_WORK_RUNTIME_SUPERVISOR_BRIDGE_VERSION) errors.push('Unexpected V250 version.');
  if (model.visualMutationAllowed !== false) errors.push('V250 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V250 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V250 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V250 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V250 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V250 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
