import { deepCloneV761, isPlainObjectV761 } from '../database/projectPersistenceContractV761.js';
import { createRuntimeChangeLogV773 } from './projectRuntimeChangeLogV773.js';
import { createRuntimeSnapshotV774 } from './projectRuntimeSnapshotV774.js';
import { recoverRuntimeProjectFromSnapshotV775 } from './projectRuntimeRecoveryV775.js';

function setSection(project, section, value) {
  if (!section || typeof section !== 'string') return project;
  const segments = section.split('.').filter(Boolean);
  if (segments.length === 0) return project;
  let cursor = project;
  segments.slice(0, -1).forEach((segment) => {
    if (!isPlainObjectV761(cursor[segment])) cursor[segment] = {};
    cursor = cursor[segment];
  });
  cursor[segments[segments.length - 1]] = deepCloneV761(value);
  return project;
}

export function createRuntimeStore() {
  let currentProject = null;
  let snapshotSequence = 0;
  const changeLog = createRuntimeChangeLogV773();

  return {
    loadProjectToRuntime(project, options = {}) {
      currentProject = isPlainObjectV761(project) ? deepCloneV761(project) : {};
      changeLog.append({
        type: 'load',
        section: '$',
        changedAt: options.changedAt,
        details: { projectId: currentProject.projectId || '' },
      });
      return { ok: true, project: deepCloneV761(currentProject), qaFindings: [] };
    },

    getCurrentProject() {
      return currentProject === null ? null : deepCloneV761(currentProject);
    },

    updateProjectSection(section, value, options = {}) {
      if (currentProject === null) currentProject = {};
      setSection(currentProject, section, value);
      changeLog.append({
        type: 'section-update',
        section,
        changedAt: options.changedAt,
        details: { valueType: Array.isArray(value) ? 'array' : typeof value },
      });
      return { ok: true, project: deepCloneV761(currentProject), changeLog: changeLog.list() };
    },

    createRuntimeSnapshot(options = {}) {
      snapshotSequence += 1;
      const snapshot = createRuntimeSnapshotV774(currentProject || {}, {
        ...options,
        sequence: snapshotSequence,
      });
      changeLog.append({
        type: 'snapshot',
        section: '$',
        changedAt: options.changedAt,
        details: { checksumLikeFingerprint: snapshot.checksumLikeFingerprint },
      });
      return snapshot;
    },

    restoreRuntimeSnapshot(snapshot, options = {}) {
      const recovery = recoverRuntimeProjectFromSnapshotV775(snapshot);
      if (recovery.ok) {
        currentProject = recovery.project;
        changeLog.append({
          type: 'restore',
          section: '$',
          changedAt: options.changedAt,
          details: { projectId: currentProject.projectId || '' },
        });
      }
      return { ...recovery, changeLog: changeLog.list() };
    },

    getRuntimeChangeLog() {
      return changeLog.list();
    },

    clearRuntimeStore(options = {}) {
      currentProject = null;
      changeLog.append({
        type: 'clear',
        section: '$',
        changedAt: options.changedAt,
      });
      return { ok: true };
    },
  };
}
