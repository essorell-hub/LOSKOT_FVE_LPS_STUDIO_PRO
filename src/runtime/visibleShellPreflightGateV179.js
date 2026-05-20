// LOSKOT FVE & LPS STUDIO PRO
// V179 Visible Shell Preflight Gate

import {
  VISIBLE_SHELL_READ_ONLY_CONTRACT_VERSION,
  createVisibleShellReadOnlyContract,
  validateVisibleShellReadOnlyContract
} from './visibleShellReadOnlyContractV178.js';

export const VISIBLE_SHELL_PREFLIGHT_GATE_VERSION = 'v179-visible-shell-preflight-gate';

export function createVisibleShellPreflightGate(options = {}) {
  const contractModel = createVisibleShellReadOnlyContract(options);
  const validation = validateVisibleShellReadOnlyContract(contractModel);
  const gates = [
    { key: 'contract-ok', ok: validation.ok },
    { key: 'data-binding-only', ok: contractModel.contract.mayBindData === true },
    { key: 'no-css', ok: contractModel.contract.mayModifyCss === false },
    { key: 'no-components', ok: contractModel.contract.mayModifyComponents === false },
    { key: 'no-approved-graphics', ok: contractModel.contract.mayModifyApprovedGraphics === false }
  ];
  const blocked = gates.filter((gate) => !gate.ok);
  return {
    gateVersion: VISIBLE_SHELL_PREFLIGHT_GATE_VERSION,
    contractVersion: VISIBLE_SHELL_READ_ONLY_CONTRACT_VERSION,
    ready: blocked.length === 0,
    visualMutationAllowed: false,
    gates,
    contractModel,
    qa: { ok: blocked.length === 0, gateCount: gates.length, blockedCount: blocked.length, errors: blocked.map((gate) => gate.key) }
  };
}

export function validateVisibleShellPreflightGate(gate = createVisibleShellPreflightGate()) {
  const errors = [];
  if (gate.gateVersion !== VISIBLE_SHELL_PREFLIGHT_GATE_VERSION) errors.push('Unexpected V179 version.');
  if (gate.visualMutationAllowed !== false) errors.push('V179 must not allow visual mutation.');
  if (!Array.isArray(gate.gates) || gate.gates.length !== 5) errors.push('V179 gate count must be 5.');
  if (!gate.qa || gate.qa.ok !== true) errors.push('V179 QA is not OK.');
  return { ok: errors.length === 0, version: gate.gateVersion, blockedCount: gate.qa?.blockedCount ?? null, errors };
}
