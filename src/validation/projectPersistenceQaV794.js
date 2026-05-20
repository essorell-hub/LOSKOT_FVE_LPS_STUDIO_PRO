import { validateProjectPersistencePayloadV764 } from '../database/projectPersistenceValidatorV764.js';
import {
  PROJECT_PERSISTENCE_QA_CODES_V761,
  createPersistenceQaFindingV761,
} from '../database/projectPersistenceContractV761.js';

export function runProjectPersistenceQaV794(payload = {}) {
  const validation = validateProjectPersistencePayloadV764(payload);
  const qaFindings = [...validation.qaFindings];

  if (!validation.ok) {
    qaFindings.push(createPersistenceQaFindingV761({
      code: PROJECT_PERSISTENCE_QA_CODES_V761.persistenceValidationFailed,
      severity: 'BLOCKER',
      message: 'Persistence validation failed.',
      path: '$',
    }));
  }

  return {
    ok: !qaFindings.some((finding) => finding.severity === 'BLOCKER'),
    qaFindings,
    errors: qaFindings.filter((finding) => finding.severity === 'BLOCKER'),
    warnings: qaFindings.filter((finding) => finding.severity !== 'BLOCKER'),
  };
}
