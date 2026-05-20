import { deserializeProjectPersistenceV763 } from '../database/projectPersistenceDeserializerV763.js';

export function validateProjectImportV784(input = {}) {
  const result = deserializeProjectPersistenceV763(input);
  return {
    ok: result.ok,
    normalizedProject: result.normalizedProject,
    blockers: result.errors,
    warnings: result.warnings,
    qaFindings: result.qaFindings,
  };
}
