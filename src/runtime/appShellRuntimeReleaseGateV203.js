// LOSKOT FVE & LPS STUDIO PRO
// V203 App Shell Runtime Release Gate

import { createAppShellRuntimeDeepAudit, validateAppShellRuntimeDeepAudit } from './appShellRuntimeDeepAuditV202.js';

export const APP_SHELL_RUNTIME_RELEASE_GATE_VERSION = 'v203-app-shell-runtime-release-gate';

export function createAppShellRuntimeReleaseGate(options = {}) {
  const deepAudit = createAppShellRuntimeDeepAudit(options);
  const validation = validateAppShellRuntimeDeepAudit(deepAudit);
  const gates = [
    { key: 'deep-audit-ok', ok: validation.ok },
    { key: 'route-count-ok', ok: deepAudit.audit.routeCount === 13 },
    { key: 'module-count-ok', ok: deepAudit.audit.moduleCount === 13 },
    { key: 'mount-points-ok', ok: deepAudit.audit.mountPointCount === 5 },
    { key: 'visual-lock-ok', ok: deepAudit.audit.visualMutationAllowed === false }
  ];
  const blocked = gates.filter((gate) => !gate.ok);
  return {
    gateVersion: APP_SHELL_RUNTIME_RELEASE_GATE_VERSION,
    ready: blocked.length === 0,
    visualMutationAllowed: false,
    gates,
    deepAudit,
    qa: { ok: blocked.length === 0, blockedCount: blocked.length, errors: blocked.map((gate) => gate.key) }
  };
}

export function validateAppShellRuntimeReleaseGate(model = createAppShellRuntimeReleaseGate()) {
  const errors = [];
  if (model.gateVersion !== APP_SHELL_RUNTIME_RELEASE_GATE_VERSION) errors.push('Unexpected V203 version.');
  if (model.visualMutationAllowed !== false) errors.push('V203 must not mutate visuals.');
  if (!Array.isArray(model.gates) || model.gates.length !== 5) errors.push('V203 gate count must be 5.');
  if (!model.qa || model.qa.ok !== true) errors.push('V203 QA is not OK.');
  return { ok: errors.length === 0, version: model.gateVersion, blockedCount: model.qa?.blockedCount ?? null, errors };
}
