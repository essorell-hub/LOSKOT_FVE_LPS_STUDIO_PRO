// LOSKOT FVE & LPS STUDIO PRO
// V168 Module Data Availability Matrix

import {
  READ_ONLY_SHELL_BINDING_VERSION,
  createReadOnlyShellBinding,
  validateReadOnlyShellBinding
} from './readOnlyShellBindingV167.js';

export const MODULE_DATA_AVAILABILITY_MATRIX_VERSION = 'v168-module-data-availability-matrix';

export function createModuleDataAvailabilityMatrix(options = {}) {
  const binding = createReadOnlyShellBinding({
    activeRouteKey: options.activeRouteKey,
    projectContext: options.projectContext
  });
  const bindingValidation = validateReadOnlyShellBinding(binding);

  const matrix = [
    { moduleId: 'dashboard', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: false },
    { moduleId: 'project-card', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'roof-site', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'fve', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'lps', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'electrical', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'spd', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'grounding', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'reports', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'documents', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'database', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'exports', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: true },
    { moduleId: 'settings', hasRuntimeData: true, hasQaFeed: true, hasExportFeed: false }
  ];

  const unavailable = matrix.filter((row) => row.hasRuntimeData !== true || row.hasQaFeed !== true);

  return {
    matrixVersion: MODULE_DATA_AVAILABILITY_MATRIX_VERSION,
    bindingVersion: READ_ONLY_SHELL_BINDING_VERSION,
    ready: bindingValidation.ok && unavailable.length === 0,
    visualMutationAllowed: false,
    matrix,
    binding,
    qa: {
      ok: bindingValidation.ok && unavailable.length === 0,
      moduleCount: matrix.length,
      unavailableCount: unavailable.length,
      errors: bindingValidation.errors
    }
  };
}

export function validateModuleDataAvailabilityMatrix(model = createModuleDataAvailabilityMatrix()) {
  const errors = [];
  if (model.matrixVersion !== MODULE_DATA_AVAILABILITY_MATRIX_VERSION) errors.push('Unexpected V168 matrix version.');
  if (model.bindingVersion !== READ_ONLY_SHELL_BINDING_VERSION) errors.push('Unexpected V167 binding version.');
  if (model.visualMutationAllowed !== false) errors.push('Data matrix must not allow visual mutation.');
  if (!Array.isArray(model.matrix) || model.matrix.length !== 13) errors.push('Data matrix must contain 13 module rows.');
  if (!model.qa || model.qa.ok !== true) errors.push('Data matrix QA is not OK.');
  return { ok: errors.length === 0, matrixVersion: model.matrixVersion, moduleCount: model.matrix?.length || 0, unavailableCount: model.qa?.unavailableCount ?? null, errors };
}
