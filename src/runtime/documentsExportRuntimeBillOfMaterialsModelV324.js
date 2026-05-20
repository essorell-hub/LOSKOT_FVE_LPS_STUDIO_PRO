// LOSKOT FVE & LPS STUDIO PRO
// V321-V340 documents export runtime production layer
// Self-contained runtime model, no visual mutation.

export const DOCUMENTS_EXPORT_RUNTIME_BILL_OF_MATERIALS_MODEL_V324_VERSION = 'v324-documents-export-runtime-bill-of-materials-model-v324';

export function createDocumentsExportRuntimeBillOfMaterialsModelV324(options = {}) {
  const activeRouteKey = options.activeRouteKey || 'dashboard';
  const projectContext = options.projectContext || {};
  const warnings = [];
  const errors = [];

  const model = {
    modelVersion: DOCUMENTS_EXPORT_RUNTIME_BILL_OF_MATERIALS_MODEL_V324_VERSION,
    versionNumber: 324,
    phaseId: 'V321-V340',
    phaseTitle: 'documents export runtime production layer',
    status: 'V324_READY',
    activeRouteKey,
    projectContext: {
      projectId: projectContext.projectId || 'V321-V340-PROJECT',
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
      lpsSpdRuntime: false,
      documentsExportRuntime: true
    },
    qa: {
      ok: true,
      warningCount: warnings.length,
      blockedCount: errors.length,
      warnings,
      errors
    },
    metrics: {
      runtimeStep: 324,
      phaseStart: 321,
      phaseEnd: 340,
      checkpointOrdinal: 4,
      routeCount: 13,
      regionCount: 5,
      qaGateCount: 7
    }
  };

  return model;
}

export function validateDocumentsExportRuntimeBillOfMaterialsModelV324(model = createDocumentsExportRuntimeBillOfMaterialsModelV324()) {
  const errors = [];
  if (model.modelVersion !== DOCUMENTS_EXPORT_RUNTIME_BILL_OF_MATERIALS_MODEL_V324_VERSION) errors.push('Unexpected model version.');
  if (model.versionNumber !== 324) errors.push('Unexpected version number.');
  if (model.phaseId !== 'V321-V340') errors.push('Unexpected phase.');
  if (!model.controls || model.controls.canMutateVisuals !== false) errors.push('Visual mutation guard failed.');
  if (!model.controls || model.controls.canWriteUi !== false) errors.push('UI write guard failed.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('Git guard failed.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('Package guard failed.');
  if (!model.qa || model.qa.ok !== true || model.qa.blockedCount !== 0) errors.push('QA guard failed.');
  if (!model.metrics || model.metrics.runtimeStep !== 324) errors.push('Runtime step invalid.');

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
