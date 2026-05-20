// LOSKOT FVE & LPS STUDIO PRO
// V169 Release Candidate Gate

import {
  MODULE_DATA_AVAILABILITY_MATRIX_VERSION,
  createModuleDataAvailabilityMatrix,
  validateModuleDataAvailabilityMatrix
} from './moduleDataAvailabilityMatrixV168.js';

export const RELEASE_CANDIDATE_GATE_VERSION = 'v169-release-candidate-gate';

export function createReleaseCandidateGate(options = {}) {
  const matrix = createModuleDataAvailabilityMatrix({
    activeRouteKey: options.activeRouteKey,
    projectContext: options.projectContext
  });
  const matrixValidation = validateModuleDataAvailabilityMatrix(matrix);

  const gates = [
    { key: 'runtime-readiness', ok: matrix.binding.controller.readiness.ready },
    { key: 'read-only-shell-binding', ok: matrix.binding.ready },
    { key: 'module-data-availability', ok: matrixValidation.ok },
    { key: 'visual-lock', ok: matrix.visualMutationAllowed === false },
    { key: 'export-manifest', ok: matrix.binding.controller.readiness.manifest.ready },
    { key: 'persistence-bridge', ok: matrix.binding.controller.readiness.manifest.bridge.ready }
  ];

  const blocked = gates.filter((gate) => gate.ok !== true);

  return {
    gateVersion: RELEASE_CANDIDATE_GATE_VERSION,
    matrixVersion: MODULE_DATA_AVAILABILITY_MATRIX_VERSION,
    releaseCandidateReady: blocked.length === 0,
    visualMutationAllowed: false,
    gates,
    matrix,
    qa: {
      ok: blocked.length === 0,
      gateCount: gates.length,
      blockedCount: blocked.length,
      errors: [...matrixValidation.errors, ...blocked.map((gate) => gate.key)]
    }
  };
}

export function validateReleaseCandidateGate(gate = createReleaseCandidateGate()) {
  const errors = [];
  if (gate.gateVersion !== RELEASE_CANDIDATE_GATE_VERSION) errors.push('Unexpected V169 gate version.');
  if (gate.matrixVersion !== MODULE_DATA_AVAILABILITY_MATRIX_VERSION) errors.push('Unexpected V168 matrix version.');
  if (gate.visualMutationAllowed !== false) errors.push('Release candidate gate must not allow visual mutation.');
  if (!Array.isArray(gate.gates) || gate.gates.length !== 6) errors.push('Release candidate gate must contain 6 gates.');
  if (!gate.qa || gate.qa.ok !== true) errors.push('Release candidate gate QA is not OK.');
  return { ok: errors.length === 0, gateVersion: gate.gateVersion, gateCount: gate.gates?.length || 0, blockedCount: gate.qa?.blockedCount ?? null, errors };
}
