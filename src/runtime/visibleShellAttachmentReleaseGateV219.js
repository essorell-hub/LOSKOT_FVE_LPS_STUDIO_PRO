// LOSKOT FVE & LPS STUDIO PRO
// V219 Visible Shell Attachment Release Gate

import { createVisibleShellAttachmentDiagnostics, validateVisibleShellAttachmentDiagnostics } from './visibleShellAttachmentDiagnosticsV218.js';

export const VISIBLE_SHELL_ATTACHMENT_RELEASE_GATE_VERSION = 'v219-visible-shell-attachment-release-gate';

export function createVisibleShellAttachmentReleaseGate(options = {}) {
  const diagnostics = createVisibleShellAttachmentDiagnostics(options);
  const validation = validateVisibleShellAttachmentDiagnostics(diagnostics);
  const gates = [
    { key: 'diagnostics-ok', ok: validation.ok },
    { key: 'visual-lock-ok', ok: diagnostics.visualMutationAllowed === false },
    { key: 'attachment-regions-ok', ok: diagnostics.projectRefresh.qaRefresh.moduleSelection.route.store.status.inspector.qaPanel.workspace.leftMenu.dataPacket.qa.packetRegionCount === 5 },
    { key: 'left-menu-ok', ok: diagnostics.projectRefresh.qaRefresh.moduleSelection.route.store.status.inspector.qaPanel.workspace.leftMenu.attachment.itemCount === 13 }
  ];
  const blocked = gates.filter((gate) => !gate.ok);
  return {
    gateVersion: VISIBLE_SHELL_ATTACHMENT_RELEASE_GATE_VERSION,
    ready: blocked.length === 0,
    visualMutationAllowed: false,
    gates,
    diagnostics,
    qa: { ok: blocked.length === 0, blockedCount: blocked.length, errors: blocked.map((gate) => gate.key) }
  };
}

export function validateVisibleShellAttachmentReleaseGate(model = createVisibleShellAttachmentReleaseGate()) {
  const errors = [];
  if (model.gateVersion !== VISIBLE_SHELL_ATTACHMENT_RELEASE_GATE_VERSION) errors.push('Unexpected V219 version.');
  if (model.visualMutationAllowed !== false) errors.push('V219 must not mutate visuals.');
  if (!Array.isArray(model.gates) || model.gates.length !== 4) errors.push('V219 gate count must be 4.');
  if (!model.qa || model.qa.ok !== true) errors.push('V219 QA is not OK.');
  return { ok: errors.length === 0, version: model.gateVersion, blockedCount: model.qa?.blockedCount ?? null, errors };
}
