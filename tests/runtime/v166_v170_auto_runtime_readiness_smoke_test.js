import assert from 'node:assert/strict';
import { createAppRuntimeCompositionController, validateAppRuntimeCompositionController } from '../../src/runtime/appRuntimeCompositionControllerV166.js';
import { createReadOnlyShellBinding, validateReadOnlyShellBinding } from '../../src/runtime/readOnlyShellBindingV167.js';
import { createModuleDataAvailabilityMatrix, validateModuleDataAvailabilityMatrix } from '../../src/runtime/moduleDataAvailabilityMatrixV168.js';
import { createReleaseCandidateGate, validateReleaseCandidateGate } from '../../src/runtime/releaseCandidateGateV169.js';
import { createFullRuntimeAuditSnapshot, validateFullRuntimeAuditSnapshot } from '../../src/runtime/fullRuntimeAuditSnapshotV170.js';

console.log('Starting V166-V170 AUTO FAST Runtime Readiness smoke test...');

const projectContext = {
  projectId: 'READINESS-PROJECT-001',
  projectName: 'Readiness projekt V166-V170',
  revision: 'test'
};

const controller = createAppRuntimeCompositionController({ activeRouteKey: 'dashboard', projectContext });
assert.equal(controller.ready, true);
assert.equal(controller.visualMutationAllowed, false);
assert.equal(controller.composition.renderMode, 'readiness-contract-only');
assert.equal(validateAppRuntimeCompositionController(controller).ok, true);

const binding = createReadOnlyShellBinding({ activeRouteKey: 'documents', projectContext });
assert.equal(binding.ready, true);
assert.equal(binding.writeToUiAllowed, false);
assert.equal(binding.readOnlyDataAllowed, true);
assert.equal(binding.shellBindingContract.modifyCss, false);
assert.equal(validateReadOnlyShellBinding(binding).ok, true);

const matrix = createModuleDataAvailabilityMatrix({ activeRouteKey: 'fve-2d-layout', projectContext });
assert.equal(matrix.ready, true);
assert.equal(matrix.matrix.length, 13);
assert.equal(matrix.qa.unavailableCount, 0);
assert.equal(validateModuleDataAvailabilityMatrix(matrix).ok, true);

const gate = createReleaseCandidateGate({ activeRouteKey: 'exports', projectContext });
assert.equal(gate.releaseCandidateReady, true);
assert.equal(gate.gates.length, 6);
assert.equal(gate.qa.blockedCount, 0);
assert.equal(validateReleaseCandidateGate(gate).ok, true);

const audit = createFullRuntimeAuditSnapshot({ activeRouteKey: 'reports-statements', projectContext });
assert.equal(audit.ready, true);
assert.equal(audit.visualMutationAllowed, false);
assert.equal(audit.snapshot.activeModuleCount, 13);
assert.equal(audit.snapshot.releaseCandidateReady, true);
const auditValidation = validateFullRuntimeAuditSnapshot(audit);
assert.equal(auditValidation.ok, true);
assert.equal(auditValidation.errors.length, 0);

console.log('V166-V170 AUTO FAST Runtime Readiness smoke test passed:', JSON.stringify({
  controller: validateAppRuntimeCompositionController(controller),
  binding: validateReadOnlyShellBinding(binding),
  matrix: validateModuleDataAvailabilityMatrix(matrix),
  gate: validateReleaseCandidateGate(gate),
  audit: auditValidation
}, null, 2));
