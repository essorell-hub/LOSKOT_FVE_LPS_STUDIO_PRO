// LOSKOT FVE & LPS STUDIO PRO
// V217 Visible Shell Project Context Refresh Bridge

import { createVisibleShellQaRefreshBridge, validateVisibleShellQaRefreshBridge } from './visibleShellQaRefreshBridgeV216.js';

export const VISIBLE_SHELL_PROJECT_CONTEXT_REFRESH_BRIDGE_VERSION = 'v217-visible-shell-project-context-refresh-bridge';

export function createVisibleShellProjectContextRefreshBridge(options = {}) {
  const qaRefresh = createVisibleShellQaRefreshBridge(options);
  const validation = validateVisibleShellQaRefreshBridge(qaRefresh);
  const projectContextRefresh = {
    readOnly: true,
    canRefreshProjectContext: true,
    canWriteUi: false,
    projectId: options.projectContext?.projectId || 'UNKNOWN'
  };
  return {
    bridgeVersion: VISIBLE_SHELL_PROJECT_CONTEXT_REFRESH_BRIDGE_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    projectContextRefresh,
    qaRefresh,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellProjectContextRefreshBridge(model = createVisibleShellProjectContextRefreshBridge()) {
  const errors = [];
  if (model.bridgeVersion !== VISIBLE_SHELL_PROJECT_CONTEXT_REFRESH_BRIDGE_VERSION) errors.push('Unexpected V217 version.');
  if (model.visualMutationAllowed !== false) errors.push('V217 must not mutate visuals.');
  if (!model.projectContextRefresh || model.projectContextRefresh.canWriteUi !== false) errors.push('V217 project context refresh unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V217 QA is not OK.');
  return { ok: errors.length === 0, version: model.bridgeVersion, projectId: model.projectContextRefresh?.projectId || null, errors };
}
