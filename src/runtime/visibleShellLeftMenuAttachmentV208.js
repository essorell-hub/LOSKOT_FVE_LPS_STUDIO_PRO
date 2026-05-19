// LOSKOT FVE & LPS STUDIO PRO
// V208 Visible Shell Left Menu Attachment

import { createVisibleShellDataPacket, validateVisibleShellDataPacket } from './visibleShellDataPacketV207.js';

export const VISIBLE_SHELL_LEFT_MENU_ATTACHMENT_VERSION = 'v208-visible-shell-left-menu-attachment';

export function createVisibleShellLeftMenuAttachment(options = {}) {
  const dataPacket = createVisibleShellDataPacket(options);
  const validation = validateVisibleShellDataPacket(dataPacket);
  const attachment = {
    region: 'left-navigation',
    readOnly: true,
    items: dataPacket.packet.leftNavigation.items || [],
    itemCount: (dataPacket.packet.leftNavigation.items || []).length,
    canModifyLayout: false
  };
  return {
    attachmentVersion: VISIBLE_SHELL_LEFT_MENU_ATTACHMENT_VERSION,
    ready: validation.ok && attachment.itemCount === 13,
    visualMutationAllowed: false,
    attachment,
    dataPacket,
    qa: { ok: validation.ok && attachment.itemCount === 13, errors: validation.errors }
  };
}

export function validateVisibleShellLeftMenuAttachment(model = createVisibleShellLeftMenuAttachment()) {
  const errors = [];
  if (model.attachmentVersion !== VISIBLE_SHELL_LEFT_MENU_ATTACHMENT_VERSION) errors.push('Unexpected V208 version.');
  if (model.visualMutationAllowed !== false) errors.push('V208 must not mutate visuals.');
  if (!model.attachment || model.attachment.itemCount !== 13) errors.push('V208 left menu item count must be 13.');
  if (!model.qa || model.qa.ok !== true) errors.push('V208 QA is not OK.');
  return { ok: errors.length === 0, version: model.attachmentVersion, itemCount: model.attachment?.itemCount || 0, errors };
}
