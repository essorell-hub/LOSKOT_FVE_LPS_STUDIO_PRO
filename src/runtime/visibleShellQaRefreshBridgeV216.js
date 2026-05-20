// LOSKOT FVE & LPS STUDIO PRO
// V216 Visible Shell QA Refresh Bridge

import { createVisibleShellModuleSelectionBridge, validateVisibleShellModuleSelectionBridge } from './visibleShellModuleSelectionBridgeV215.js';

export const VISIBLE_SHELL_QA_REFRESH_BRIDGE_VERSION = 'v216-visible-shell-qa-refresh-bridge';

export function createVisibleShellQaRefreshBridge(options = {}) {
  const moduleSelection = createVisibleShellModuleSelectionBridge(options);
  const validation = validateVisibleShellModuleSelectionBridge(moduleSelection);
  const qaRefresh = {
    readOnly: true,
    canRefreshData: true,
    canWriteUi: false,
    failedCount: 0
  };
  return {
    bridgeVersion: VISIBLE_SHELL_QA_REFRESH_BRIDGE_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    qaRefresh,
    moduleSelection,
    qa: { ok: validation.ok && qaRefresh.failedCount === 0, failedCount: qaRefresh.failedCount, errors: validation.errors }
  };
}

export function validateVisibleShellQaRefreshBridge(model = createVisibleShellQaRefreshBridge()) {
  const errors = [];
  if (model.bridgeVersion !== VISIBLE_SHELL_QA_REFRESH_BRIDGE_VERSION) errors.push('Unexpected V216 version.');
  if (model.visualMutationAllowed !== false) errors.push('V216 must not mutate visuals.');
  if (!model.qaRefresh || model.qaRefresh.canWriteUi !== false) errors.push('V216 QA refresh unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V216 QA is not OK.');
  return { ok: errors.length === 0, version: model.bridgeVersion, failedCount: model.qaRefresh?.failedCount ?? null, errors };
}
