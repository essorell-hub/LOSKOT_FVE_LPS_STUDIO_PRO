// LOSKOT FVE & LPS STUDIO PRO
// V170 Full Runtime Audit Snapshot

import {
  RELEASE_CANDIDATE_GATE_VERSION,
  createReleaseCandidateGate,
  validateReleaseCandidateGate
} from './releaseCandidateGateV169.js';

export const FULL_RUNTIME_AUDIT_SNAPSHOT_VERSION = 'v170-full-runtime-audit-snapshot';

export function createFullRuntimeAuditSnapshot(options = {}) {
  const gate = createReleaseCandidateGate({
    activeRouteKey: options.activeRouteKey,
    projectContext: options.projectContext
  });
  const gateValidation = validateReleaseCandidateGate(gate);

  const snapshot = {
    projectIdentity: gate.matrix.binding.controller.readiness.projectIdentity,
    activeRouteKey: gate.matrix.binding.activeRouteKey,
    activeModuleCount: gate.matrix.matrix.length,
    readinessStatus: gate.matrix.binding.controller.status,
    releaseCandidateReady: gate.releaseCandidateReady,
    visualMutationAllowed: false,
    packageReady: gate.matrix.binding.controller.readiness.manifest.ready,
    persistenceReady: gate.matrix.binding.controller.readiness.manifest.bridge.ready,
    qaOk: gate.qa.ok
  };

  return {
    snapshotVersion: FULL_RUNTIME_AUDIT_SNAPSHOT_VERSION,
    gateVersion: RELEASE_CANDIDATE_GATE_VERSION,
    ready: gateValidation.ok,
    visualMutationAllowed: false,
    snapshot,
    gate,
    qa: {
      ok: gateValidation.ok,
      snapshotComplete: Boolean(snapshot.projectIdentity && snapshot.activeModuleCount === 13),
      errors: gateValidation.errors
    }
  };
}

export function validateFullRuntimeAuditSnapshot(audit = createFullRuntimeAuditSnapshot()) {
  const errors = [];
  if (audit.snapshotVersion !== FULL_RUNTIME_AUDIT_SNAPSHOT_VERSION) errors.push('Unexpected V170 audit snapshot version.');
  if (audit.gateVersion !== RELEASE_CANDIDATE_GATE_VERSION) errors.push('Unexpected V169 gate version.');
  if (audit.visualMutationAllowed !== false) errors.push('Audit snapshot must not allow visual mutation.');
  if (!audit.snapshot || audit.snapshot.activeModuleCount !== 13) errors.push('Audit snapshot module count is invalid.');
  if (!audit.qa || audit.qa.ok !== true) errors.push('Audit snapshot QA is not OK.');
  return { ok: errors.length === 0, snapshotVersion: audit.snapshotVersion, ready: audit.ready, releaseCandidateReady: audit.snapshot?.releaseCandidateReady ?? false, activeModuleCount: audit.snapshot?.activeModuleCount ?? 0, errors };
}
