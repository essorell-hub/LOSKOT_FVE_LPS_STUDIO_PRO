// LOSKOT FVE & LPS STUDIO PRO
// V211 Visible Shell Inspector Attachment

import { createVisibleShellQaPanelAttachment, validateVisibleShellQaPanelAttachment } from './visibleShellQaPanelAttachmentV210.js';

export const VISIBLE_SHELL_INSPECTOR_ATTACHMENT_VERSION = 'v211-visible-shell-inspector-attachment';

export function createVisibleShellInspectorAttachment(options = {}) {
  const qaPanel = createVisibleShellQaPanelAttachment(options);
  const validation = validateVisibleShellQaPanelAttachment(qaPanel);
  const inspector = {
    region: 'project-inspector',
    readOnly: true,
    source: qaPanel.workspace.leftMenu.dataPacket.packet.projectInspector,
    canWriteUi: false
  };
  return {
    attachmentVersion: VISIBLE_SHELL_INSPECTOR_ATTACHMENT_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    inspector,
    qaPanel,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellInspectorAttachment(model = createVisibleShellInspectorAttachment()) {
  const errors = [];
  if (model.attachmentVersion !== VISIBLE_SHELL_INSPECTOR_ATTACHMENT_VERSION) errors.push('Unexpected V211 version.');
  if (model.visualMutationAllowed !== false) errors.push('V211 must not mutate visuals.');
  if (!model.inspector || model.inspector.canWriteUi !== false) errors.push('V211 inspector unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V211 QA is not OK.');
  return { ok: errors.length === 0, version: model.attachmentVersion, errors };
}
