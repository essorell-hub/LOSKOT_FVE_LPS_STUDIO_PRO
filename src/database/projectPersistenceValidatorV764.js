import {
  PROJECT_PERSISTENCE_REQUIRED_FIELDS_V761,
  createPersistenceQaFindingV761,
  isPlainObjectV761,
} from './projectPersistenceContractV761.js';
import { runProjectIntegrityQaV791 } from '../validation/projectIntegrityQaV791.js';
import { runProjectReferenceIntegrityQaV792 } from '../validation/projectReferenceIntegrityQaV792.js';
import { runProjectSchemaDriftQaV793 } from '../validation/projectSchemaDriftQaV793.js';

export function validateProjectPersistencePayloadV764(payload = {}) {
  const findings = [];

  if (!isPlainObjectV761(payload)) {
    findings.push(createPersistenceQaFindingV761({
      severity: 'BLOCKER',
      message: 'Persistence payload must be an object.',
      path: '$',
    }));
  }

  PROJECT_PERSISTENCE_REQUIRED_FIELDS_V761.forEach((field) => {
    if (!(field in (payload || {}))) {
      findings.push(createPersistenceQaFindingV761({
        severity: ['qaSummary', 'metadata', 'integrity'].includes(field) ? 'WARNING' : 'BLOCKER',
        message: `Missing persistence field: ${field}.`,
        path: `$.${field}`,
      }));
    }
  });

  const qaResults = [
    runProjectIntegrityQaV791(payload),
    runProjectReferenceIntegrityQaV792(payload),
    runProjectSchemaDriftQaV793(payload),
  ];

  qaResults.forEach((result) => findings.push(...result.qaFindings));

  const blockers = findings.filter((finding) => finding.severity === 'BLOCKER');
  const warnings = findings.filter((finding) => finding.severity !== 'BLOCKER');
  return {
    ok: blockers.length === 0,
    errors: blockers,
    warnings,
    qaFindings: findings,
  };
}
