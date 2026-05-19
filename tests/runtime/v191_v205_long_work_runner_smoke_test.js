import assert from 'node:assert/strict';
import { createAppShellRuntimeMountModel, validateAppShellRuntimeMountModel } from '../../src/runtime/appShellRuntimeMountModelV191.js';
import { createAppShellRouteRuntimeMap, validateAppShellRouteRuntimeMap } from '../../src/runtime/appShellRouteRuntimeMapV192.js';
import { createAppShellModuleRuntimeMap, validateAppShellModuleRuntimeMap } from '../../src/runtime/appShellModuleRuntimeMapV193.js';
import { createAppShellLeftMenuRuntimeModel, validateAppShellLeftMenuRuntimeModel } from '../../src/runtime/appShellLeftMenuRuntimeModelV194.js';
import { createAppShellWorkspaceRuntimeModel, validateAppShellWorkspaceRuntimeModel } from '../../src/runtime/appShellWorkspaceRuntimeModelV195.js';
import { createAppShellRightQaRuntimeModel, validateAppShellRightQaRuntimeModel } from '../../src/runtime/appShellRightQaRuntimeModelV196.js';
import { createAppShellProjectInspectorRuntimeModel, validateAppShellProjectInspectorRuntimeModel } from '../../src/runtime/appShellProjectInspectorRuntimeModelV197.js';
import { createAppShellRuntimeSynchronizationPlan, validateAppShellRuntimeSynchronizationPlan } from '../../src/runtime/appShellRuntimeSynchronizationPlanV198.js';
import { createAppShellRuntimeEventQueue, validateAppShellRuntimeEventQueue } from '../../src/runtime/appShellRuntimeEventQueueV199.js';
import { createAppShellRuntimeCommandPreview, validateAppShellRuntimeCommandPreview } from '../../src/runtime/appShellRuntimeCommandPreviewV200.js';
import { createAppShellRuntimeDiagnostics, validateAppShellRuntimeDiagnostics } from '../../src/runtime/appShellRuntimeDiagnosticsV201.js';
import { createAppShellRuntimeDeepAudit, validateAppShellRuntimeDeepAudit } from '../../src/runtime/appShellRuntimeDeepAuditV202.js';
import { createAppShellRuntimeReleaseGate, validateAppShellRuntimeReleaseGate } from '../../src/runtime/appShellRuntimeReleaseGateV203.js';
import { createAppShellRuntimeWorkPlan, validateAppShellRuntimeWorkPlan } from '../../src/runtime/appShellRuntimeWorkPlanV204.js';
import { createAppShellRuntimeMilestone, validateAppShellRuntimeMilestone } from '../../src/runtime/appShellRuntimeMilestoneV205.js';

console.log('Starting V191-V205 LONG WORK runner smoke test...');

const projectContext = { projectId: 'V191-V205-PROJECT', projectName: 'Long work runtime models', revision: 'test' };

const mount = createAppShellRuntimeMountModel({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellRuntimeMountModel(mount).ok, true);
assert.equal(mount.mountPoints.length, 5);

const routes = createAppShellRouteRuntimeMap({ activeRouteKey: 'documents', projectContext });
assert.equal(validateAppShellRouteRuntimeMap(routes).ok, true);
assert.equal(routes.routeMap.length, 13);

const modules = createAppShellModuleRuntimeMap({ activeRouteKey: 'fve-2d-layout', projectContext });
assert.equal(validateAppShellModuleRuntimeMap(modules).ok, true);
assert.equal(modules.moduleMap.length, 13);

const leftMenu = createAppShellLeftMenuRuntimeModel({ activeRouteKey: 'lps-lightning-protection', projectContext });
assert.equal(validateAppShellLeftMenuRuntimeModel(leftMenu).ok, true);
assert.equal(leftMenu.leftMenu.length, 13);

const workspace = createAppShellWorkspaceRuntimeModel({ activeRouteKey: 'reports-statements', projectContext });
assert.equal(validateAppShellWorkspaceRuntimeModel(workspace).ok, true);
assert.equal(workspace.workspace.canWriteUi, false);

const rightQa = createAppShellRightQaRuntimeModel({ activeRouteKey: 'database', projectContext });
assert.equal(validateAppShellRightQaRuntimeModel(rightQa).ok, true);
assert.equal(rightQa.rightQa.failedCount, 0);

const inspector = createAppShellProjectInspectorRuntimeModel({ activeRouteKey: 'exports', projectContext });
assert.equal(validateAppShellProjectInspectorRuntimeModel(inspector).ok, true);
assert.equal(inspector.inspector.readOnly, true);

const sync = createAppShellRuntimeSynchronizationPlan({ activeRouteKey: 'settings', projectContext });
assert.equal(validateAppShellRuntimeSynchronizationPlan(sync).ok, true);
assert.equal(sync.syncSteps.length, 4);

const queue = createAppShellRuntimeEventQueue({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellRuntimeEventQueue(queue).ok, true);
assert.equal(queue.events.length, 3);

const commands = createAppShellRuntimeCommandPreview({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellRuntimeCommandPreview(commands).ok, true);
assert.equal(commands.commands.length, 3);

const diagnostics = createAppShellRuntimeDiagnostics({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellRuntimeDiagnostics(diagnostics).ok, true);
assert.equal(diagnostics.qa.failedCount, 0);

const deepAudit = createAppShellRuntimeDeepAudit({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellRuntimeDeepAudit(deepAudit).ok, true);
assert.equal(deepAudit.audit.routeCount, 13);
assert.equal(deepAudit.audit.moduleCount, 13);

const releaseGate = createAppShellRuntimeReleaseGate({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellRuntimeReleaseGate(releaseGate).ok, true);
assert.equal(releaseGate.qa.blockedCount, 0);

const workPlan = createAppShellRuntimeWorkPlan({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellRuntimeWorkPlan(workPlan).ok, true);
assert.equal(workPlan.workItems.length, 5);

const milestone = createAppShellRuntimeMilestone({ activeRouteKey: 'dashboard', projectContext });
const milestoneValidation = validateAppShellRuntimeMilestone(milestone);
assert.equal(milestoneValidation.ok, true);
assert.equal(milestone.status, 'READY_FOR_SAFE_VISIBLE_ATTACHMENT');

console.log('V191-V205 LONG WORK runner smoke test passed:', JSON.stringify({
  mount: validateAppShellRuntimeMountModel(mount),
  routes: validateAppShellRouteRuntimeMap(routes),
  modules: validateAppShellModuleRuntimeMap(modules),
  leftMenu: validateAppShellLeftMenuRuntimeModel(leftMenu),
  workspace: validateAppShellWorkspaceRuntimeModel(workspace),
  rightQa: validateAppShellRightQaRuntimeModel(rightQa),
  inspector: validateAppShellProjectInspectorRuntimeModel(inspector),
  sync: validateAppShellRuntimeSynchronizationPlan(sync),
  queue: validateAppShellRuntimeEventQueue(queue),
  commands: validateAppShellRuntimeCommandPreview(commands),
  diagnostics: validateAppShellRuntimeDiagnostics(diagnostics),
  deepAudit: validateAppShellRuntimeDeepAudit(deepAudit),
  releaseGate: validateAppShellRuntimeReleaseGate(releaseGate),
  workPlan: validateAppShellRuntimeWorkPlan(workPlan),
  milestone: milestoneValidation
}, null, 2));
