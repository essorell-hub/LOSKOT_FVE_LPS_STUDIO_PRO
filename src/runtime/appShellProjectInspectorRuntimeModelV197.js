// LOSKOT FVE & LPS STUDIO PRO
// V197 App Shell Project Inspector Runtime Model

import { createAppShellRightQaRuntimeModel, validateAppShellRightQaRuntimeModel } from './appShellRightQaRuntimeModelV196.js';

export const APP_SHELL_PROJECT_INSPECTOR_RUNTIME_MODEL_VERSION = 'v197-app-shell-project-inspector-runtime-model';

export function createAppShellProjectInspectorRuntimeModel(options = {}) {
  const rightQa = createAppShellRightQaRuntimeModel(options);
  const validation = validateAppShellRightQaRuntimeModel(rightQa);
  const projectHeader = rightQa.workspace.leftMenu.modules.routes.mount.plan.gate.validator.snapshotModel.snapshot.projectHeader;
  const inspector = {
    projectId: projectHeader.projectId || 'UNKNOWN',
    projectName: projectHeader.projectName || 'LOSKOT projekt',
    revision: projectHeader.revision || 'pracovní',
    readOnly: true
  };
  return {
    modelVersion: APP_SHELL_PROJECT_INSPECTOR_RUNTIME_MODEL_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    inspector,
    rightQa,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateAppShellProjectInspectorRuntimeModel(model = createAppShellProjectInspectorRuntimeModel()) {
  const errors = [];
  if (model.modelVersion !== APP_SHELL_PROJECT_INSPECTOR_RUNTIME_MODEL_VERSION) errors.push('Unexpected V197 version.');
  if (model.visualMutationAllowed !== false) errors.push('V197 must not mutate visuals.');
  if (!model.inspector || model.inspector.readOnly !== true) errors.push('V197 inspector must be read-only.');
  if (!model.qa || model.qa.ok !== true) errors.push('V197 QA is not OK.');
  return { ok: errors.length === 0, version: model.modelVersion, projectId: model.inspector?.projectId || null, errors };
}
