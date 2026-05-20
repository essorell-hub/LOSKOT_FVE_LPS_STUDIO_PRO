import assert from 'node:assert/strict';
import { createAppShellRuntimeMilestone, validateAppShellRuntimeMilestone } from '../../src/runtime/appShellRuntimeMilestoneV205.js';
import { createAppShellRuntimeDeepAudit, validateAppShellRuntimeDeepAudit } from '../../src/runtime/appShellRuntimeDeepAuditV202.js';
import { createAppShellRuntimeReleaseGate, validateAppShellRuntimeReleaseGate } from '../../src/runtime/appShellRuntimeReleaseGateV203.js';

console.log('Starting V191-V205 deep audit test...');

const routeKeys = [
  'dashboard',
  'documents',
  'reports-statements',
  'fve-2d-layout',
  'lps-lightning-protection',
  'database',
  'exports',
  'settings'
];

const results = [];
for (const activeRouteKey of routeKeys) {
  const projectContext = { projectId: 'DEEP-' + activeRouteKey, projectName: 'Deep audit ' + activeRouteKey, revision: 'audit' };
  const audit = createAppShellRuntimeDeepAudit({ activeRouteKey, projectContext });
  const auditValidation = validateAppShellRuntimeDeepAudit(audit);
  const gate = createAppShellRuntimeReleaseGate({ activeRouteKey, projectContext });
  const gateValidation = validateAppShellRuntimeReleaseGate(gate);
  const milestone = createAppShellRuntimeMilestone({ activeRouteKey, projectContext });
  const milestoneValidation = validateAppShellRuntimeMilestone(milestone);

  assert.equal(auditValidation.ok, true);
  assert.equal(gateValidation.ok, true);
  assert.equal(milestoneValidation.ok, true);
  assert.equal(audit.audit.routeCount, 13);
  assert.equal(audit.audit.moduleCount, 13);
  assert.equal(audit.audit.mountPointCount, 5);
  assert.equal(gate.qa.blockedCount, 0);
  assert.equal(milestone.status, 'READY_FOR_SAFE_VISIBLE_ATTACHMENT');

  results.push({ activeRouteKey, audit: auditValidation, gate: gateValidation, milestone: milestoneValidation });
}

console.log('V191-V205 deep audit test passed:', JSON.stringify({ routeCount: routeKeys.length, results }, null, 2));
