// LOSKOT FVE & LPS STUDIO PRO
// V218 Visible Shell Attachment Diagnostics

import { createVisibleShellProjectContextRefreshBridge, validateVisibleShellProjectContextRefreshBridge } from './visibleShellProjectContextRefreshBridgeV217.js';

export const VISIBLE_SHELL_ATTACHMENT_DIAGNOSTICS_VERSION = 'v218-visible-shell-attachment-diagnostics';

export function createVisibleShellAttachmentDiagnostics(options = {}) {
  const projectRefresh = createVisibleShellProjectContextRefreshBridge(options);
  const validation = validateVisibleShellProjectContextRefreshBridge(projectRefresh);
  const diagnostics = [
    { key: 'attachment-chain-ready', ok: validation.ok },
    { key: 'visual-lock', ok: projectRefresh.visualMutationAllowed === false },
    { key: 'qa-refresh-ok', ok: projectRefresh.qaRefresh.qa.failedCount === 0 },
    { key: 'project-context-ok', ok: Boolean(projectRefresh.projectContextRefresh.projectId) }
  ];
  const failed = diagnostics.filter((item) => !item.ok);
  return {
    diagnosticsVersion: VISIBLE_SHELL_ATTACHMENT_DIAGNOSTICS_VERSION,
    ready: failed.length === 0,
    visualMutationAllowed: false,
    diagnostics,
    projectRefresh,
    qa: { ok: failed.length === 0, failedCount: failed.length, errors: failed.map((item) => item.key) }
  };
}

export function validateVisibleShellAttachmentDiagnostics(model = createVisibleShellAttachmentDiagnostics()) {
  const errors = [];
  if (model.diagnosticsVersion !== VISIBLE_SHELL_ATTACHMENT_DIAGNOSTICS_VERSION) errors.push('Unexpected V218 version.');
  if (model.visualMutationAllowed !== false) errors.push('V218 must not mutate visuals.');
  if (!Array.isArray(model.diagnostics) || model.diagnostics.length !== 4) errors.push('V218 diagnostics count must be 4.');
  if (!model.qa || model.qa.ok !== true) errors.push('V218 QA is not OK.');
  return { ok: errors.length === 0, version: model.diagnosticsVersion, failedCount: model.qa?.failedCount ?? null, errors };
}
