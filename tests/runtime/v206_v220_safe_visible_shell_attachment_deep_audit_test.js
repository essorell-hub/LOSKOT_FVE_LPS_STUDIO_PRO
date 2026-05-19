import assert from 'node:assert/strict';
import { createVisibleShellAttachmentMilestone, validateVisibleShellAttachmentMilestone } from '../../src/runtime/visibleShellAttachmentMilestoneV220.js';
import { createVisibleShellAttachmentReleaseGate, validateVisibleShellAttachmentReleaseGate } from '../../src/runtime/visibleShellAttachmentReleaseGateV219.js';
import { createVisibleShellAttachmentDiagnostics, validateVisibleShellAttachmentDiagnostics } from '../../src/runtime/visibleShellAttachmentDiagnosticsV218.js';

console.log('Starting V206-V220 SAFE visible shell attachment deep audit test...');

const routeKeys = ['dashboard', 'documents', 'reports-statements', 'fve-2d-layout', 'lps-lightning-protection', 'database', 'exports', 'settings'];
const results = [];

for (const activeRouteKey of routeKeys) {
  const projectContext = { projectId: 'V206-DEEP-' + activeRouteKey, projectName: 'V206 deep audit ' + activeRouteKey, revision: 'audit' };
  const diagnostics = createVisibleShellAttachmentDiagnostics({ activeRouteKey, projectContext });
  const diagnosticsValidation = validateVisibleShellAttachmentDiagnostics(diagnostics);
  const gate = createVisibleShellAttachmentReleaseGate({ activeRouteKey, projectContext });
  const gateValidation = validateVisibleShellAttachmentReleaseGate(gate);
  const milestone = createVisibleShellAttachmentMilestone({ activeRouteKey, projectContext });
  const milestoneValidation = validateVisibleShellAttachmentMilestone(milestone);

  assert.equal(diagnosticsValidation.ok, true);
  assert.equal(gateValidation.ok, true);
  assert.equal(milestoneValidation.ok, true);
  assert.equal(diagnostics.qa.failedCount, 0);
  assert.equal(gate.qa.blockedCount, 0);
  assert.equal(milestone.status, 'READY_FOR_CONTROLLED_APP_INTEGRATION');
  assert.equal(milestone.visualMutationAllowed, false);

  results.push({ activeRouteKey, diagnostics: diagnosticsValidation, gate: gateValidation, milestone: milestoneValidation });
}

console.log('V206-V220 deep audit test passed:', JSON.stringify({ routeCount: routeKeys.length, results }, null, 2));
