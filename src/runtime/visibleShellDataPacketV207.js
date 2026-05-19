// LOSKOT FVE & LPS STUDIO PRO
// V207 Visible Shell Data Packet

import { createVisibleShellAttachmentRegistry, validateVisibleShellAttachmentRegistry } from './visibleShellAttachmentRegistryV206.js';

export const VISIBLE_SHELL_DATA_PACKET_VERSION = 'v207-visible-shell-data-packet';

export function createVisibleShellDataPacket(options = {}) {
  const registry = createVisibleShellAttachmentRegistry(options);
  const validation = validateVisibleShellAttachmentRegistry(registry);
  const snapshot = registry.milestone.workPlan.releaseGate.deepAudit.diagnostics.preview.queue.sync.inspector.rightQa.workspace.leftMenu.modules.routes.mount.plan.gate.validator.snapshotModel.snapshot;
  const packet = {
    leftNavigation: snapshot.navigation,
    centralWorkspace: snapshot.workspace,
    rightQaPanel: snapshot.qaPanel,
    projectInspector: snapshot.projectHeader,
    statusFooter: snapshot.statusFooter
  };
  return {
    packetVersion: VISIBLE_SHELL_DATA_PACKET_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    packet,
    registry,
    qa: { ok: validation.ok && Object.keys(packet).length === 5, packetRegionCount: Object.keys(packet).length, errors: validation.errors }
  };
}

export function validateVisibleShellDataPacket(model = createVisibleShellDataPacket()) {
  const errors = [];
  if (model.packetVersion !== VISIBLE_SHELL_DATA_PACKET_VERSION) errors.push('Unexpected V207 version.');
  if (model.visualMutationAllowed !== false) errors.push('V207 must not mutate visuals.');
  if (!model.packet || Object.keys(model.packet).length !== 5) errors.push('V207 packet must have 5 regions.');
  if (!model.qa || model.qa.ok !== true) errors.push('V207 QA is not OK.');
  return { ok: errors.length === 0, version: model.packetVersion, packetRegionCount: model.qa?.packetRegionCount || 0, errors };
}
