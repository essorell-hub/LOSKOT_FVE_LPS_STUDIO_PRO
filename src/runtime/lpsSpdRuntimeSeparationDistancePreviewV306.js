// LOSKOT FVE & LPS STUDIO PRO
// V301-V320 LPS SPD runtime production layer
// Self-contained runtime model, no visual mutation.

export const LPS_SPD_RUNTIME_SEPARATION_DISTANCE_PREVIEW_V306_VERSION = 'v306-lps-spd-runtime-separation-distance-preview-v306';

export function createLpsSpdRuntimeSeparationDistancePreviewV306(options = {}) {
  const activeRouteKey = options.activeRouteKey || 'dashboard';
  const projectContext = options.projectContext || {};
  const warnings = [];
  const errors = [];

  const model = {
    modelVersion: LPS_SPD_RUNTIME_SEPARATION_DISTANCE_PREVIEW_V306_VERSION,
    versionNumber: 306,
    phaseId: 'V301-V320',
    phaseTitle: 'LPS SPD runtime production layer',
    status: 'V306_READY',
    activeRouteKey,
    projectContext: {
      projectId: projectContext.projectId || 'V301-V320-PROJECT',
      projectName: projectContext.projectName || 'LOSKOT FVE LPS Studio PRO',
      revision: projectContext.revision || 'runtime-preview'
    },
    controls: {
      readOnly: true,
      canWriteUi: false,
      canMutateVisuals: false,
      canPush: false,
      canMerge: false,
      canChangePackage: false,
      canTouchApprovedScreens: false
    },
    productionScope: {
      projectRuntime: false,
      fveRuntime: false,
      lpsSpdRuntime: true,
      documentsExportRuntime: false
    },
    qa: {
      ok: true,
      warningCount: warnings.length,
      blockedCount: errors.length,
      warnings,
      errors
    },
    metrics: {
      runtimeStep: 306,
      phaseStart: 301,
      phaseEnd: 320,
      checkpointOrdinal: 6,
      routeCount: 13,
      regionCount: 5,
      qaGateCount: 7
    }
  };

  return model;
}

export function validateLpsSpdRuntimeSeparationDistancePreviewV306(model = createLpsSpdRuntimeSeparationDistancePreviewV306()) {
  const errors = [];
  if (model.modelVersion !== LPS_SPD_RUNTIME_SEPARATION_DISTANCE_PREVIEW_V306_VERSION) errors.push('Unexpected model version.');
  if (model.versionNumber !== 306) errors.push('Unexpected version number.');
  if (model.phaseId !== 'V301-V320') errors.push('Unexpected phase.');
  if (!model.controls || model.controls.canMutateVisuals !== false) errors.push('Visual mutation guard failed.');
  if (!model.controls || model.controls.canWriteUi !== false) errors.push('UI write guard failed.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('Git guard failed.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('Package guard failed.');
  if (!model.qa || model.qa.ok !== true || model.qa.blockedCount !== 0) errors.push('QA guard failed.');
  if (!model.metrics || model.metrics.runtimeStep !== 306) errors.push('Runtime step invalid.');

  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    versionNumber: model.versionNumber,
    phaseId: model.phaseId,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
