import { serializeProjectPersistenceV762 } from '../database/projectPersistenceSerializerV762.js';
import { createProjectPortablePackageV783 } from './projectPortablePackageV783.js';
import { validateProjectExportV785 } from './projectExportValidationV785.js';

export function exportProjectToJsonPackageV781(unifiedProject = {}, options = {}) {
  const serialized = serializeProjectPersistenceV762(unifiedProject, options);
  const validation = validateProjectExportV785(serialized.payload);
  const portablePackage = createProjectPortablePackageV783(serialized.payload, {
    generatedAt: options.generatedAt || serialized.payload.savedAt,
    qaSummary: serialized.payload.qaSummary,
  });

  return {
    ok: validation.ok,
    project: serialized.payload,
    package: portablePackage,
    json: portablePackage,
    blockers: validation.blockers,
    warnings: validation.warnings,
    errors: validation.blockers,
    qaFindings: validation.qaFindings,
  };
}
