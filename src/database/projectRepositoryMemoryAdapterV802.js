import { deserializeProjectPersistenceV763 } from './projectPersistenceDeserializerV763.js';
import { serializeProjectPersistenceV762 } from './projectPersistenceSerializerV762.js';
import {
  PROJECT_REPOSITORY_CAPABILITIES_V801,
  createProjectRepositoryResultV801,
} from './projectRepositoryContractV801.js';
import { deepCloneV761 } from './projectPersistenceContractV761.js';

export function createProjectRepositoryMemoryAdapterV802(initialProjects = []) {
  const records = new Map();
  (Array.isArray(initialProjects) ? initialProjects : []).forEach((project) => {
    if (project?.projectId) records.set(project.projectId, deepCloneV761(project));
  });

  return {
    adapterName: 'projectRepositoryMemoryAdapterV802',
    capabilities: [
      PROJECT_REPOSITORY_CAPABILITIES_V801.load,
      PROJECT_REPOSITORY_CAPABILITIES_V801.save,
      PROJECT_REPOSITORY_CAPABILITIES_V801.list,
      PROJECT_REPOSITORY_CAPABILITIES_V801.remove,
    ],

    save(project, options = {}) {
      const payload = project?.formatVersion ? project : serializeProjectPersistenceV762(project, options).payload;
      const normalized = deserializeProjectPersistenceV763(payload);
      if (!normalized.ok) {
        return createProjectRepositoryResultV801({
          ok: false,
          errors: normalized.errors,
          warnings: normalized.warnings,
          qaFindings: normalized.qaFindings,
        });
      }
      records.set(normalized.project.projectId, deepCloneV761(normalized.project));
      return createProjectRepositoryResultV801({ data: deepCloneV761(normalized.project), qaFindings: normalized.qaFindings });
    },

    load(projectId) {
      if (!records.has(projectId)) {
        return createProjectRepositoryResultV801({
          ok: false,
          errors: [{ code: 'REPOSITORY-MEMORY-404', severity: 'BLOCKER', message: 'Project not found.', path: '$.projectId' }],
        });
      }
      return createProjectRepositoryResultV801({ data: deepCloneV761(records.get(projectId)) });
    },

    list() {
      return createProjectRepositoryResultV801({
        data: [...records.values()].map((project) => ({
          projectId: project.projectId,
          projectName: project.projectName,
          savedAt: project.savedAt,
        })),
      });
    },

    remove(projectId) {
      const existed = records.delete(projectId);
      return createProjectRepositoryResultV801({ ok: existed, data: { removed: existed, projectId } });
    },
  };
}
