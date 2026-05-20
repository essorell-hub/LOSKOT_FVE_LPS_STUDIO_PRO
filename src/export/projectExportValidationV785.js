import { validateProjectPersistencePayloadV764 } from '../database/projectPersistenceValidatorV764.js';

export function validateProjectExportV785(payload = {}) {
  const validation = validateProjectPersistencePayloadV764(payload);
  return {
    ok: validation.ok,
    blockers: validation.errors,
    warnings: validation.warnings,
    qaFindings: validation.qaFindings,
  };
}
