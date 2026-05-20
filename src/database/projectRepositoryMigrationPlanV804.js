import { PROJECT_PERSISTENCE_FORMAT_VERSION_V761 } from './projectPersistenceContractV761.js';

export function createProjectRepositoryMigrationPlanV804(inputFormatVersion = '') {
  const steps = [];
  if (!inputFormatVersion) {
    steps.push({
      id: 'migration-detect-format',
      action: 'detect-format-version',
      required: true,
    });
  }
  if (inputFormatVersion && inputFormatVersion !== PROJECT_PERSISTENCE_FORMAT_VERSION_V761) {
    steps.push({
      id: 'migration-normalize-v761',
      action: 'normalize-to-v761-persistence-envelope',
      required: true,
      from: inputFormatVersion,
      to: PROJECT_PERSISTENCE_FORMAT_VERSION_V761,
    });
  }
  steps.push({
    id: 'migration-validate-v764',
    action: 'run-persistence-validator',
    required: true,
  });

  return {
    planVersion: 'V804',
    targetFormatVersion: PROJECT_PERSISTENCE_FORMAT_VERSION_V761,
    inputFormatVersion,
    steps,
    sqliteRepositoryReady: false,
    notes: ['Preview-only migration plan. No filesystem or database writes are performed.'],
  };
}
