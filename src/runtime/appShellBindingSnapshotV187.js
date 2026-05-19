// LOSKOT FVE & LPS STUDIO PRO
// V187 App Shell Binding Snapshot

import { createAppShellStatusFooterBinding, validateAppShellStatusFooterBinding } from './appShellStatusFooterBindingV186.js';

export const APP_SHELL_BINDING_SNAPSHOT_VERSION = 'v187-app-shell-binding-snapshot';

export function createAppShellBindingSnapshot(options = {}) {
  const footer = createAppShellStatusFooterBinding(options);
  const validation = validateAppShellStatusFooterBinding(footer);
  const snapshot = {
    navigation: footer.header.qaPanel.workspace.navigation.navigationBinding,
    workspace: footer.header.qaPanel.workspace.workspaceBinding,
    qaPanel: footer.header.qaPanel.qaPanelBinding,
    projectHeader: footer.header.projectHeaderBinding,
    statusFooter: footer.statusFooterBinding
  };
  return {
    snapshotVersion: APP_SHELL_BINDING_SNAPSHOT_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    snapshot,
    footer,
    qa: { ok: validation.ok && Object.keys(snapshot).length === 5, regionCount: Object.keys(snapshot).length, errors: validation.errors }
  };
}

export function validateAppShellBindingSnapshot(model = createAppShellBindingSnapshot()) {
  const errors = [];
  if (model.snapshotVersion !== APP_SHELL_BINDING_SNAPSHOT_VERSION) errors.push('Unexpected V187 version.');
  if (model.visualMutationAllowed !== false) errors.push('V187 must not mutate visuals.');
  if (!model.snapshot || Object.keys(model.snapshot).length !== 5) errors.push('V187 snapshot region count must be 5.');
  if (!model.qa || model.qa.ok !== true) errors.push('V187 QA is not OK.');
  return { ok: errors.length === 0, version: model.snapshotVersion, regionCount: model.qa?.regionCount || 0, errors };
}
