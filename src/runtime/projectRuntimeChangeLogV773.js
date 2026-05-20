import { deepCloneV761 } from '../database/projectPersistenceContractV761.js';

export function createRuntimeChangeLogV773(initialEntries = []) {
  const entries = Array.isArray(initialEntries) ? deepCloneV761(initialEntries) : [];

  return {
    append(entry = {}) {
      const nextIndex = entries.length + 1;
      entries.push({
        sequence: nextIndex,
        changedAt: entry.changedAt || `runtime-change-${String(nextIndex).padStart(4, '0')}`,
        type: entry.type || 'update',
        section: entry.section || '',
        details: entry.details || {},
      });
      return entries[entries.length - 1];
    },
    list() {
      return deepCloneV761(entries);
    },
    clear() {
      entries.length = 0;
    },
  };
}
