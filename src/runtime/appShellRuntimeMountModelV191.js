// LOSKOT FVE & LPS STUDIO PRO
// V191 App Shell Runtime Mount Model

import { createAppShellRuntimeAttachmentPlan, validateAppShellRuntimeAttachmentPlan } from './appShellRuntimeAttachmentPlanV190.js';

export const APP_SHELL_RUNTIME_MOUNT_MODEL_VERSION = 'v191-app-shell-runtime-mount-model';

export function createAppShellRuntimeMountModel(options = {}) {
  const plan = createAppShellRuntimeAttachmentPlan(options);
  const validation = validateAppShellRuntimeAttachmentPlan(plan);
  const mountPoints = [
    { key: 'left-navigation', ready: true, readOnly: true },
    { key: 'central-workspace', ready: true, readOnly: true },
    { key: 'right-qa-panel', ready: true, readOnly: true },
    { key: 'project-header', ready: true, readOnly: true },
    { key: 'status-footer', ready: true, readOnly: true }
  ];
  return {
    modelVersion: APP_SHELL_RUNTIME_MOUNT_MODEL_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    mountPoints,
    plan,
    qa: { ok: validation.ok && mountPoints.length === 5, mountPointCount: mountPoints.length, errors: validation.errors }
  };
}

export function validateAppShellRuntimeMountModel(model = createAppShellRuntimeMountModel()) {
  const errors = [];
  if (model.modelVersion !== APP_SHELL_RUNTIME_MOUNT_MODEL_VERSION) errors.push('Unexpected V191 version.');
  if (model.visualMutationAllowed !== false) errors.push('V191 must not mutate visuals.');
  if (!Array.isArray(model.mountPoints) || model.mountPoints.length !== 5) errors.push('V191 mount point count must be 5.');
  if (!model.qa || model.qa.ok !== true) errors.push('V191 QA is not OK.');
  return { ok: errors.length === 0, version: model.modelVersion, mountPointCount: model.mountPoints?.length || 0, errors };
}
