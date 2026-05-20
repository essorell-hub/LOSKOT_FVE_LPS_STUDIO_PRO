import assert from 'node:assert/strict';
import { createVisibleShellAttachmentRegistry, validateVisibleShellAttachmentRegistry } from '../../src/runtime/visibleShellAttachmentRegistryV206.js';
import { createVisibleShellDataPacket, validateVisibleShellDataPacket } from '../../src/runtime/visibleShellDataPacketV207.js';
import { createVisibleShellLeftMenuAttachment, validateVisibleShellLeftMenuAttachment } from '../../src/runtime/visibleShellLeftMenuAttachmentV208.js';
import { createVisibleShellWorkspaceAttachment, validateVisibleShellWorkspaceAttachment } from '../../src/runtime/visibleShellWorkspaceAttachmentV209.js';
import { createVisibleShellQaPanelAttachment, validateVisibleShellQaPanelAttachment } from '../../src/runtime/visibleShellQaPanelAttachmentV210.js';
import { createVisibleShellInspectorAttachment, validateVisibleShellInspectorAttachment } from '../../src/runtime/visibleShellInspectorAttachmentV211.js';
import { createVisibleShellStatusAttachment, validateVisibleShellStatusAttachment } from '../../src/runtime/visibleShellStatusAttachmentV212.js';
import { createVisibleShellRuntimeStoreBridge, validateVisibleShellRuntimeStoreBridge } from '../../src/runtime/visibleShellRuntimeStoreBridgeV213.js';
import { createVisibleShellRouteSelectionBridge, validateVisibleShellRouteSelectionBridge } from '../../src/runtime/visibleShellRouteSelectionBridgeV214.js';
import { createVisibleShellModuleSelectionBridge, validateVisibleShellModuleSelectionBridge } from '../../src/runtime/visibleShellModuleSelectionBridgeV215.js';
import { createVisibleShellQaRefreshBridge, validateVisibleShellQaRefreshBridge } from '../../src/runtime/visibleShellQaRefreshBridgeV216.js';
import { createVisibleShellProjectContextRefreshBridge, validateVisibleShellProjectContextRefreshBridge } from '../../src/runtime/visibleShellProjectContextRefreshBridgeV217.js';
import { createVisibleShellAttachmentDiagnostics, validateVisibleShellAttachmentDiagnostics } from '../../src/runtime/visibleShellAttachmentDiagnosticsV218.js';
import { createVisibleShellAttachmentReleaseGate, validateVisibleShellAttachmentReleaseGate } from '../../src/runtime/visibleShellAttachmentReleaseGateV219.js';
import { createVisibleShellAttachmentMilestone, validateVisibleShellAttachmentMilestone } from '../../src/runtime/visibleShellAttachmentMilestoneV220.js';

console.log('Starting V206-V220 SAFE visible shell attachment smoke test...');

const projectContext = { projectId: 'V206-V220-PROJECT', projectName: 'Safe visible shell attachment', revision: 'test' };

const registry = createVisibleShellAttachmentRegistry({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateVisibleShellAttachmentRegistry(registry).ok, true);
assert.equal(registry.regions.length, 5);

const dataPacket = createVisibleShellDataPacket({ activeRouteKey: 'documents', projectContext });
assert.equal(validateVisibleShellDataPacket(dataPacket).ok, true);
assert.equal(dataPacket.qa.packetRegionCount, 5);

const leftMenu = createVisibleShellLeftMenuAttachment({ activeRouteKey: 'fve-2d-layout', projectContext });
assert.equal(validateVisibleShellLeftMenuAttachment(leftMenu).ok, true);
assert.equal(leftMenu.attachment.itemCount, 13);

const workspace = createVisibleShellWorkspaceAttachment({ activeRouteKey: 'reports-statements', projectContext });
assert.equal(validateVisibleShellWorkspaceAttachment(workspace).ok, true);
assert.equal(workspace.workspace.canModifyLayout, false);

const qaPanel = createVisibleShellQaPanelAttachment({ activeRouteKey: 'database', projectContext });
assert.equal(validateVisibleShellQaPanelAttachment(qaPanel).ok, true);
assert.equal(qaPanel.qaPanel.failedCount, 0);

const inspector = createVisibleShellInspectorAttachment({ activeRouteKey: 'exports', projectContext });
assert.equal(validateVisibleShellInspectorAttachment(inspector).ok, true);
assert.equal(inspector.inspector.canWriteUi, false);

const status = createVisibleShellStatusAttachment({ activeRouteKey: 'settings', projectContext });
assert.equal(validateVisibleShellStatusAttachment(status).ok, true);
assert.equal(status.status.canWriteUi, false);

const store = createVisibleShellRuntimeStoreBridge({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateVisibleShellRuntimeStoreBridge(store).ok, true);
assert.equal(store.storeBridge.canWriteStore, false);

const route = createVisibleShellRouteSelectionBridge({ activeRouteKey: 'documents', projectContext });
assert.equal(validateVisibleShellRouteSelectionBridge(route).ok, true);
assert.equal(route.routeSelection.canMutateRouteState, false);

const moduleSelection = createVisibleShellModuleSelectionBridge({ activeRouteKey: 'documents', projectContext });
assert.equal(validateVisibleShellModuleSelectionBridge(moduleSelection).ok, true);
assert.equal(moduleSelection.moduleSelection.canMutateModuleState, false);

const qaRefresh = createVisibleShellQaRefreshBridge({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateVisibleShellQaRefreshBridge(qaRefresh).ok, true);
assert.equal(qaRefresh.qaRefresh.failedCount, 0);

const projectRefresh = createVisibleShellProjectContextRefreshBridge({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateVisibleShellProjectContextRefreshBridge(projectRefresh).ok, true);
assert.equal(projectRefresh.projectContextRefresh.canWriteUi, false);

const diagnostics = createVisibleShellAttachmentDiagnostics({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateVisibleShellAttachmentDiagnostics(diagnostics).ok, true);
assert.equal(diagnostics.qa.failedCount, 0);

const releaseGate = createVisibleShellAttachmentReleaseGate({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateVisibleShellAttachmentReleaseGate(releaseGate).ok, true);
assert.equal(releaseGate.qa.blockedCount, 0);

const milestone = createVisibleShellAttachmentMilestone({ activeRouteKey: 'dashboard', projectContext });
const milestoneValidation = validateVisibleShellAttachmentMilestone(milestone);
assert.equal(milestoneValidation.ok, true);
assert.equal(milestone.status, 'READY_FOR_CONTROLLED_APP_INTEGRATION');

console.log('V206-V220 SAFE visible shell attachment smoke test passed:', JSON.stringify({
  registry: validateVisibleShellAttachmentRegistry(registry),
  dataPacket: validateVisibleShellDataPacket(dataPacket),
  leftMenu: validateVisibleShellLeftMenuAttachment(leftMenu),
  workspace: validateVisibleShellWorkspaceAttachment(workspace),
  qaPanel: validateVisibleShellQaPanelAttachment(qaPanel),
  inspector: validateVisibleShellInspectorAttachment(inspector),
  status: validateVisibleShellStatusAttachment(status),
  store: validateVisibleShellRuntimeStoreBridge(store),
  route: validateVisibleShellRouteSelectionBridge(route),
  moduleSelection: validateVisibleShellModuleSelectionBridge(moduleSelection),
  qaRefresh: validateVisibleShellQaRefreshBridge(qaRefresh),
  projectRefresh: validateVisibleShellProjectContextRefreshBridge(projectRefresh),
  diagnostics: validateVisibleShellAttachmentDiagnostics(diagnostics),
  releaseGate: validateVisibleShellAttachmentReleaseGate(releaseGate),
  milestone: milestoneValidation
}, null, 2));
