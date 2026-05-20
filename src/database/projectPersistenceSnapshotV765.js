import {
  createChecksumLikeFingerprintV761,
  deepCloneV761,
  isPlainObjectV761,
} from './projectPersistenceContractV761.js';

export function createProjectPersistenceSnapshotV765(projectPayload, options = {}) {
  const payload = isPlainObjectV761(projectPayload) ? deepCloneV761(projectPayload) : {};
  const projectId = payload.projectId || payload.unifiedProject?.project?.projectId || payload.unifiedProject?.projectId || '';
  const createdAt = options.createdAt || payload.savedAt || new Date(0).toISOString();

  return {
    projectId,
    createdAt,
    checksumLikeFingerprint: createChecksumLikeFingerprintV761(payload),
    payload,
  };
}

export function compareProjectPersistenceSnapshotsV765(left, right) {
  return {
    sameProjectId: (left?.projectId || '') === (right?.projectId || ''),
    sameFingerprint: (left?.checksumLikeFingerprint || '') === (right?.checksumLikeFingerprint || ''),
  };
}
