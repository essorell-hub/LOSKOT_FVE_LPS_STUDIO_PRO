// LOSKOT FVE & LPS STUDIO PRO
// V209 Visible Shell Workspace Attachment

import { createVisibleShellLeftMenuAttachment, validateVisibleShellLeftMenuAttachment } from './visibleShellLeftMenuAttachmentV208.js';

export const VISIBLE_SHELL_WORKSPACE_ATTACHMENT_VERSION = 'v209-visible-shell-workspace-attachment';

export function createVisibleShellWorkspaceAttachment(options = {}) {
  const leftMenu = createVisibleShellLeftMenuAttachment(options);
  const validation = validateVisibleShellLeftMenuAttachment(leftMenu);
  const workspace = {
    region: 'central-workspace',
    readOnly: true,
    source: leftMenu.dataPacket.packet.centralWorkspace,
    canModifyLayout: false,
    canRenderVisualChange: false
  };
  return {
    attachmentVersion: VISIBLE_SHELL_WORKSPACE_ATTACHMENT_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    workspace,
    leftMenu,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellWorkspaceAttachment(model = createVisibleShellWorkspaceAttachment()) {
  const errors = [];
  if (model.attachmentVersion !== VISIBLE_SHELL_WORKSPACE_ATTACHMENT_VERSION) errors.push('Unexpected V209 version.');
  if (model.visualMutationAllowed !== false) errors.push('V209 must not mutate visuals.');
  if (!model.workspace || model.workspace.canModifyLayout !== false || model.workspace.canRenderVisualChange !== false) errors.push('V209 workspace unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V209 QA is not OK.');
  return { ok: errors.length === 0, version: model.attachmentVersion, errors };
}
