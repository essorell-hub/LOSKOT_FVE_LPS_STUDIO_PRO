import { deserializeProjectPersistenceV763 } from '../database/projectPersistenceDeserializerV763.js';
import { validateProjectImportV784 } from './projectImportValidationV784.js';

export function importProjectFromJsonV782(input = {}) {
  const payload = input?.packageVersion && input?.projectPayload ? input.projectPayload : input;
  const validation = validateProjectImportV784(payload);
  const deserialized = deserializeProjectPersistenceV763(payload);
  return {
    ok: validation.ok && deserialized.ok,
    project: deserialized.normalizedProject,
    normalizedProject: deserialized.normalizedProject,
    errors: validation.blockers,
    warnings: validation.warnings,
    qaFindings: validation.qaFindings,
  };
}
