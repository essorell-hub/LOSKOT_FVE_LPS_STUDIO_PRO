// LOSKOT FVE & LPS STUDIO PRO
// V210 Visible Shell QA Panel Attachment

import { createVisibleShellWorkspaceAttachment, validateVisibleShellWorkspaceAttachment } from './visibleShellWorkspaceAttachmentV209.js';

export const VISIBLE_SHELL_QA_PANEL_ATTACHMENT_VERSION = 'v210-visible-shell-qa-panel-attachment';

export function createVisibleShellQaPanelAttachment(options = {}) {
  const workspace = createVisibleShellWorkspaceAttachment(options);
  const validation = validateVisibleShellWorkspaceAttachment(workspace);
  const qaPanel = {
    region: 'right-qa-panel',
    readOnly: true,
    source: workspace.leftMenu.dataPacket.packet.rightQaPanel,
    failedCount: workspace.leftMenu.dataPacket.packet.rightQaPanel.failedCount || 0,
    canWriteUi: false
  };
  return {
    attachmentVersion: VISIBLE_SHELL_QA_PANEL_ATTACHMENT_VERSION,
    ready: validation.ok && qaPanel.failedCount === 0,
    visualMutationAllowed: false,
    qaPanel,
    workspace,
    qa: { ok: validation.ok && qaPanel.failedCount === 0, failedCount: qaPanel.failedCount, errors: validation.errors }
  };
}

export function validateVisibleShellQaPanelAttachment(model = createVisibleShellQaPanelAttachment()) {
  const errors = [];
  if (model.attachmentVersion !== VISIBLE_SHELL_QA_PANEL_ATTACHMENT_VERSION) errors.push('Unexpected V210 version.');
  if (model.visualMutationAllowed !== false) errors.push('V210 must not mutate visuals.');
  if (!model.qaPanel || model.qaPanel.canWriteUi !== false) errors.push('V210 QA panel unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V210 QA is not OK.');
  return { ok: errors.length === 0, version: model.attachmentVersion, failedCount: model.qaPanel?.failedCount ?? null, errors };
}
