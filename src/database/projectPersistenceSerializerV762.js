import {
  PROJECT_PERSISTENCE_FORMAT_VERSION_V761,
  PROJECT_PERSISTENCE_SOURCE_APP_V761,
  createChecksumLikeFingerprintV761,
  deepCloneV761,
  isPlainObjectV761,
  normalizeQaSummaryV761,
} from './projectPersistenceContractV761.js';
import { validateProjectPersistencePayloadV764 } from './projectPersistenceValidatorV764.js';

function deriveProjectId(unifiedProject = {}, fallback = '') {
  return unifiedProject.projectId || unifiedProject.project?.projectId || unifiedProject.project?.id || fallback || '';
}

function deriveProjectName(unifiedProject = {}, fallback = '') {
  return unifiedProject.projectName || unifiedProject.project?.projectName || unifiedProject.project?.name || fallback || '';
}

export function serializeProjectPersistenceV762(unifiedProjectInput = {}, options = {}) {
  const unifiedProject = isPlainObjectV761(unifiedProjectInput) ? deepCloneV761(unifiedProjectInput) : {};
  const savedAt = options.savedAt || new Date(0).toISOString();
  const projectId = options.projectId || deriveProjectId(unifiedProject);
  const projectName = options.projectName || deriveProjectName(unifiedProject);
  const documents = Array.isArray(options.documents) ? deepCloneV761(options.documents) : deepCloneV761(unifiedProject.documents || []);
  const bom = deepCloneV761(options.bom || unifiedProject.bom || {});
  const exportManifest = deepCloneV761(options.exportManifest || unifiedProject.exportManifest || { version: 'V761', artifacts: [] });
  const metadata = deepCloneV761(options.metadata || {});

  const payload = {
    formatVersion: PROJECT_PERSISTENCE_FORMAT_VERSION_V761,
    projectId,
    projectName,
    savedAt,
    sourceApp: PROJECT_PERSISTENCE_SOURCE_APP_V761,
    unifiedProject,
    documents,
    bom,
    qaSummary: normalizeQaSummaryV761(options.qaSummary),
    exportManifest,
    metadata,
    integrity: {
      checksumLikeFingerprint: '',
      serializerVersion: 'V762',
    },
  };

  const validation = validateProjectPersistencePayloadV764(payload);
  payload.qaSummary = normalizeQaSummaryV761({
    ...payload.qaSummary,
    qaFindings: validation.qaFindings,
    errors: validation.errors,
    warnings: validation.warnings,
  });
  payload.integrity.checksumLikeFingerprint = createChecksumLikeFingerprintV761({
    ...payload,
    integrity: { serializerVersion: 'V762' },
  });

  return {
    ok: validation.ok,
    payload,
    errors: validation.errors,
    warnings: validation.warnings,
    qaFindings: validation.qaFindings,
  };
}
