import { createProjectPersistenceSnapshotV765 } from '../database/projectPersistenceSnapshotV765.js';

export function createRuntimeSnapshotV774(currentProject, options = {}) {
  const snapshot = createProjectPersistenceSnapshotV765(currentProject || {}, {
    createdAt: options.createdAt || `runtime-snapshot-${String(options.sequence || 1).padStart(4, '0')}`,
  });
  return {
    ...snapshot,
    snapshotVersion: 'V774',
    sequence: options.sequence || 1,
  };
}
