import { deepCloneV761, isPlainObjectV761 } from '../database/projectPersistenceContractV761.js';

export function recoverRuntimeProjectFromSnapshotV775(snapshot = {}) {
  if (!isPlainObjectV761(snapshot) || !isPlainObjectV761(snapshot.payload)) {
    return {
      ok: false,
      project: null,
      errors: [{ code: 'RUNTIME-RECOVERY-001', severity: 'BLOCKER', message: 'Runtime snapshot payload is missing.' }],
      warnings: [],
    };
  }

  return {
    ok: true,
    project: deepCloneV761(snapshot.payload),
    errors: [],
    warnings: [],
  };
}
