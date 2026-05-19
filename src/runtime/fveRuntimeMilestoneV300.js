// LOSKOT FVE & LPS STUDIO PRO
// V281-V300 FVE runtime production layer
// Self-contained runtime model, no visual mutation.

export const FVE_RUNTIME_MILESTONE_V300_VERSION = 'v300-fve-runtime-milestone-v300';

export function createFveRuntimeMilestoneV300(options = {}) {
  const activeRouteKey = options.activeRouteKey || 'dashboard';
  const projectContext = options.projectContext || {};
  const warnings = [];
  const errors = [];

  const model = {
    modelVersion: FVE_RUNTIME_MILESTONE_V300_VERSION,
    versionNumber: 300,
    phaseId: 'V281-V300',
    phaseTitle: 'FVE runtime production layer',
    status: 'READY_V281_V300',
    activeRouteKey,
    projectContext: {
      projectId: projectContext.projectId || 'V281-V300-PROJECT',
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
      fveRuntime: true,
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
      runtimeStep: 300,
      phaseStart: 281,
      phaseEnd: 300,
      checkpointOrdinal: 20,
      routeCount: 13,
      regionCount: 5,
      qaGateCount: 7
    }
  };

  return model;
}

export function validateFveRuntimeMilestoneV300(model = createFveRuntimeMilestoneV300()) {
  const errors = [];
  if (model.modelVersion !== FVE_RUNTIME_MILESTONE_V300_VERSION) errors.push('Unexpected model version.');
  if (model.versionNumber !== 300) errors.push('Unexpected version number.');
  if (model.phaseId !== 'V281-V300') errors.push('Unexpected phase.');
  if (!model.controls || model.controls.canMutateVisuals !== false) errors.push('Visual mutation guard failed.');
  if (!model.controls || model.controls.canWriteUi !== false) errors.push('UI write guard failed.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('Git guard failed.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('Package guard failed.');
  if (!model.qa || model.qa.ok !== true || model.qa.blockedCount !== 0) errors.push('QA guard failed.');
  if (!model.metrics || model.metrics.runtimeStep !== 300) errors.push('Runtime step invalid.');

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
