import assert from 'node:assert/strict';
import { createNightWorkRuntimeMilestone, validateNightWorkRuntimeMilestone } from '../../src/runtime/nightWorkRuntimeMilestoneV260.js';
import { createControlledAppIntegrationDeepAudit, validateControlledAppIntegrationDeepAudit } from '../../src/runtime/controlledAppIntegrationDeepAuditV237.js';
import { createNightWorkRuntimeFinalAudit, validateNightWorkRuntimeFinalAudit } from '../../src/runtime/nightWorkRuntimeFinalAuditV258.js';

console.log('Starting V221-V260 NIGHT WORK deep audit test...');

const routeKeys = ['dashboard', 'documents', 'reports-statements', 'fve-2d-layout', 'lps-lightning-protection', 'database', 'exports', 'settings'];
const results = [];
for (const activeRouteKey of routeKeys) {
  const projectContext = { projectId: 'NIGHT-' + activeRouteKey, projectName: 'Night audit ' + activeRouteKey, revision: 'audit' };
  const deepAudit = createControlledAppIntegrationDeepAudit({ activeRouteKey, projectContext });
  const deepValidation = validateControlledAppIntegrationDeepAudit(deepAudit);
  const finalAudit = createNightWorkRuntimeFinalAudit({ activeRouteKey, projectContext });
  const finalValidation = validateNightWorkRuntimeFinalAudit(finalAudit);
  const milestone = createNightWorkRuntimeMilestone({ activeRouteKey, projectContext });
  const milestoneValidation = validateNightWorkRuntimeMilestone(milestone);

  assert.equal(deepValidation.ok, true);
  assert.equal(finalValidation.ok, true);
  assert.equal(milestoneValidation.ok, true);
  assert.equal(milestone.visualMutationAllowed, false);
  assert.equal(milestone.controls.canPush, false);
  assert.equal(milestone.controls.canMerge, false);
  assert.equal(milestone.controls.canChangePackage, false);
  assert.equal(milestone.status, 'READY_FOR_NIGHT_SUPERVISED_APP_INTEGRATION');
  results.push({ activeRouteKey, deepValidation, finalValidation, milestoneValidation });
}

console.log('V221-V260 NIGHT WORK deep audit test passed:', JSON.stringify({ routeCount: routeKeys.length, results }, null, 2));
