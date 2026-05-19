// LOSKOT FVE & LPS STUDIO PRO
// V212 Visible Shell Status Attachment

import { createVisibleShellInspectorAttachment, validateVisibleShellInspectorAttachment } from './visibleShellInspectorAttachmentV211.js';

export const VISIBLE_SHELL_STATUS_ATTACHMENT_VERSION = 'v212-visible-shell-status-attachment';

export function createVisibleShellStatusAttachment(options = {}) {
  const inspector = createVisibleShellInspectorAttachment(options);
  const validation = validateVisibleShellInspectorAttachment(inspector);
  const status = {
    region: 'status-footer',
    readOnly: true,
    source: inspector.qaPanel.workspace.leftMenu.dataPacket.packet.statusFooter,
    canWriteUi: false
  };
  return {
    attachmentVersion: VISIBLE_SHELL_STATUS_ATTACHMENT_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    status,
    inspector,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellStatusAttachment(model = createVisibleShellStatusAttachment()) {
  const errors = [];
  if (model.attachmentVersion !== VISIBLE_SHELL_STATUS_ATTACHMENT_VERSION) errors.push('Unexpected V212 version.');
  if (model.visualMutationAllowed !== false) errors.push('V212 must not mutate visuals.');
  if (!model.status || model.status.canWriteUi !== false) errors.push('V212 status unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V212 QA is not OK.');
  return { ok: errors.length === 0, version: model.attachmentVersion, errors };
}
