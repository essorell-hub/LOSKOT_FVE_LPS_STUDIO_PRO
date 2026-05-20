// LOSKOT FVE & LPS STUDIO PRO
// V213 Visible Shell Runtime Store Bridge

import { createVisibleShellStatusAttachment, validateVisibleShellStatusAttachment } from './visibleShellStatusAttachmentV212.js';

export const VISIBLE_SHELL_RUNTIME_STORE_BRIDGE_VERSION = 'v213-visible-shell-runtime-store-bridge';

export function createVisibleShellRuntimeStoreBridge(options = {}) {
  const status = createVisibleShellStatusAttachment(options);
  const validation = validateVisibleShellStatusAttachment(status);
  const storeBridge = {
    readOnly: true,
    canWriteStore: false,
    canReadStore: true,
    attachmentReady: validation.ok
  };
  return {
    bridgeVersion: VISIBLE_SHELL_RUNTIME_STORE_BRIDGE_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    storeBridge,
    status,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellRuntimeStoreBridge(model = createVisibleShellRuntimeStoreBridge()) {
  const errors = [];
  if (model.bridgeVersion !== VISIBLE_SHELL_RUNTIME_STORE_BRIDGE_VERSION) errors.push('Unexpected V213 version.');
  if (model.visualMutationAllowed !== false) errors.push('V213 must not mutate visuals.');
  if (!model.storeBridge || model.storeBridge.canWriteStore !== false) errors.push('V213 store bridge unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V213 QA is not OK.');
  return { ok: errors.length === 0, version: model.bridgeVersion, errors };
}
