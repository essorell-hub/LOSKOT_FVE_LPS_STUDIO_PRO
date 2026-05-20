// LOSKOT FVE & LPS STUDIO PRO
// V261-V280 project runtime core
// Self-contained runtime model, no visual mutation.

export const PROJECT_RUNTIME_MILESTONE_V280_VERSION = 'v280-project-runtime-milestone-v280';

export function createProjectRuntimeMilestoneV280(options = {}) {
  const activeRouteKey = options.activeRouteKey || 'dashboard';
  const projectContext = options.projectContext || {};
  const warnings = [];
  const errors = [];

  const model = {
    modelVersion: PROJECT_RUNTIME_MILESTONE_V280_VERSION,
    versionNumber: 280,
    phaseId: 'V261-V280',
    phaseTitle: 'project runtime core',
    status: 'READY_V261_V280',
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
      runtimeStep: 280,
      phaseStart: 261,
      phaseEnd: 280,
      checkpointOrdinal: 20,
      routeCount: 13,
      regionCount: 5,
      qaGateCount: 7
    }
  };

  return model;
}

export function validateProjectRuntimeMilestoneV280(model = createProjectRuntimeMilestoneV280()) {
  const errors = [];
  if (model.modelVersion !== PROJECT_RUNTIME_MILESTONE_V280_VERSION) errors.push('Unexpected model version.');
  if (model.versionNumber !== 280) errors.push('Unexpected version number.');
  if (model.phaseId !== 'V261-V280') errors.push('Unexpected phase.');
  if (!model.controls || model.controls.canMutateVisuals !== false) errors.push('Visual mutation guard failed.');
  if (!model.controls || model.controls.canWriteUi !== false) errors.push('UI write guard failed.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('Git guard failed.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('Package guard failed.');
  if (!model.qa || model.qa.ok !== true || model.qa.blockedCount !== 0) errors.push('QA guard failed.');
  if (!model.metrics || model.metrics.runtimeStep !== 280) errors.push('Runtime step invalid.');

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
