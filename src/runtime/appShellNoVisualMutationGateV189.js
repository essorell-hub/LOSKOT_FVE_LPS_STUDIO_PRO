// LOSKOT FVE & LPS STUDIO PRO
// V189 App Shell No Visual Mutation Gate

import { createAppShellBindingValidator, validateAppShellBindingValidator } from './appShellBindingValidatorV188.js';

export const APP_SHELL_NO_VISUAL_MUTATION_GATE_VERSION = 'v189-app-shell-no-visual-mutation-gate';

export function createAppShellNoVisualMutationGate(options = {}) {
  const validator = createAppShellBindingValidator(options);
  const validation = validateAppShellBindingValidator(validator);
  const gates = [
    { key: 'validator-ok', ok: validation.ok },
    { key: 'snapshot-read-only', ok: validator.qa.failedCount === 0 },
    { key: 'no-visual-mutation', ok: validator.visualMutationAllowed === false },
    { key: 'no-ui-write', ok: validator.snapshotModel.footer.header.qaPanel.workspace.navigation.binder.writeToUiAllowed === false }
  ];
  const blocked = gates.filter((gate) => !gate.ok);
  return {
    gateVersion: APP_SHELL_NO_VISUAL_MUTATION_GATE_VERSION,
    ready: blocked.length === 0,
    visualMutationAllowed: false,
    gates,
    validator,
    qa: { ok: blocked.length === 0, blockedCount: blocked.length, errors: blocked.map((gate) => gate.key) }
  };
}

export function validateAppShellNoVisualMutationGate(model = createAppShellNoVisualMutationGate()) {
  const errors = [];
  if (model.gateVersion !== APP_SHELL_NO_VISUAL_MUTATION_GATE_VERSION) errors.push('Unexpected V189 version.');
  if (model.visualMutationAllowed !== false) errors.push('V189 must not mutate visuals.');
  if (!Array.isArray(model.gates) || model.gates.length !== 4) errors.push('V189 gate count must be 4.');
  if (!model.qa || model.qa.ok !== true) errors.push('V189 QA is not OK.');
  return { ok: errors.length === 0, version: model.gateVersion, blockedCount: model.qa?.blockedCount ?? null, errors };
}
