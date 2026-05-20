// LOSKOT FVE & LPS STUDIO PRO
// V261-V280 project runtime core
// Self-contained runtime model, no visual mutation.

export const PROJECT_RUNTIME_RELEASE_GATE_V278_VERSION = 'v278-project-runtime-release-gate-v278';

export function createProjectRuntimeReleaseGateV278(options = {}) {
  const activeRouteKey = options.activeRouteKey || 'dashboard';
  const projectContext = options.projectContext || {};
  const warnings = [];
  const errors = [];

  const model = {
    modelVersion: PROJECT_RUNTIME_RELEASE_GATE_V278_VERSION,
    versionNumber: 278,
    phaseId: 'V261-V280',
    phaseTitle: 'project runtime core',
    status: 'V278_READY',
    activeRouteKey,
    projectContext: {
      projectId: projectContext.projectId || 'V261-V280-PROJECT',
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
      projectRuntime: true,
      fveRuntime: false,
      lpsSpdRuntime: false,
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
      runtimeStep: 278,
      phaseStart: 261,
      phaseEnd: 280,
      checkpointOrdinal: 18,
      routeCount: 13,
      regionCount: 5,
      qaGateCount: 7
    }
  };

  return model;
}

export function validateProjectRuntimeReleaseGateV278(model = createProjectRuntimeReleaseGateV278()) {
  const errors = [];
  if (model.modelVersion !== PROJECT_RUNTIME_RELEASE_GATE_V278_VERSION) errors.push('Unexpected model version.');
  if (model.versionNumber !== 278) errors.push('Unexpected version number.');
  if (model.phaseId !== 'V261-V280') errors.push('Unexpected phase.');
  if (!model.controls || model.controls.canMutateVisuals !== false) errors.push('Visual mutation guard failed.');
  if (!model.controls || model.controls.canWriteUi !== false) errors.push('UI write guard failed.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('Git guard failed.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('Package guard failed.');
  if (!model.qa || model.qa.ok !== true || model.qa.blockedCount !== 0) errors.push('QA guard failed.');
  if (!model.metrics || model.metrics.runtimeStep !== 278) errors.push('Runtime step invalid.');

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
