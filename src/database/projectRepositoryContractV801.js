import {
  PROJECT_PERSISTENCE_QA_CODES_V761,
  createPersistenceQaFindingV761,
} from './projectPersistenceContractV761.js';

export const PROJECT_REPOSITORY_CAPABILITIES_V801 = Object.freeze({
  load: 'load',
  save: 'save',
  list: 'list',
  remove: 'remove',
  exportJson: 'exportJson',
  importJson: 'importJson',
});

export function createProjectRepositoryResultV801({ ok = true, data = null, errors = [], warnings = [], qaFindings = [] } = {}) {
  return { ok, data, errors, warnings, qaFindings };
}

export function assertProjectRepositoryCapabilityV801(adapter = {}, capability = '') {
  const capabilities = Array.isArray(adapter.capabilities) ? adapter.capabilities : [];
  if (capabilities.includes(capability)) {
    return createProjectRepositoryResultV801({ ok: true, data: { capability } });
  }

  const finding = createPersistenceQaFindingV761({
    code: PROJECT_PERSISTENCE_QA_CODES_V761.repositoryMissingCapability,
    severity: 'BLOCKER',
    message: 'Repository adapter is missing a required capability.',
    path: '$.capabilities',
    details: { capability },
  });
  return createProjectRepositoryResultV801({ ok: false, errors: [finding], qaFindings: [finding] });
}
