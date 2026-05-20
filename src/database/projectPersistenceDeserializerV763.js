import {
  PROJECT_PERSISTENCE_FORMAT_VERSION_V761,
  PROJECT_PERSISTENCE_SOURCE_APP_V761,
  createEmptyPersistenceEnvelopeV761,
  deepCloneV761,
  isPlainObjectV761,
  normalizeQaSummaryV761,
} from './projectPersistenceContractV761.js';
import { validateProjectPersistencePayloadV764 } from './projectPersistenceValidatorV764.js';

export function deserializeProjectPersistenceV763(input = {}) {
  try {
    const source = isPlainObjectV761(input) ? deepCloneV761(input) : {};
    const unifiedProject = isPlainObjectV761(source.unifiedProject) ? source.unifiedProject : {};
    const normalized = createEmptyPersistenceEnvelopeV761({
      ...source,
      formatVersion: source.formatVersion || '',
      projectId: source.projectId || unifiedProject.projectId || unifiedProject.project?.projectId || unifiedProject.project?.id || '',
      projectName: source.projectName || unifiedProject.projectName || unifiedProject.project?.projectName || unifiedProject.project?.name || '',
      savedAt: source.savedAt || '',
      sourceApp: source.sourceApp || PROJECT_PERSISTENCE_SOURCE_APP_V761,
      unifiedProject,
      documents: Array.isArray(source.documents) ? source.documents : [],
      bom: isPlainObjectV761(source.bom) ? source.bom : {},
      qaSummary: normalizeQaSummaryV761(source.qaSummary),
      exportManifest: isPlainObjectV761(source.exportManifest) ? source.exportManifest : {},
      metadata: isPlainObjectV761(source.metadata) ? source.metadata : {},
      integrity: isPlainObjectV761(source.integrity) ? source.integrity : {},
    });

    if (!normalized.formatVersion && source.formatVersion === undefined) {
      normalized.formatVersion = '';
    }
    if (normalized.formatVersion && normalized.formatVersion !== PROJECT_PERSISTENCE_FORMAT_VERSION_V761) {
      normalized.metadata.detectedFormatVersion = normalized.formatVersion;
    }

    const validation = validateProjectPersistencePayloadV764(normalized);
    normalized.qaSummary = normalizeQaSummaryV761({
      ...normalized.qaSummary,
      qaFindings: validation.qaFindings,
      errors: validation.errors,
      warnings: validation.warnings,
    });

    return {
      ok: validation.ok,
      project: normalized,
      normalizedProject: normalized,
      errors: validation.errors,
      warnings: validation.warnings,
      qaFindings: validation.qaFindings,
    };
  } catch (error) {
    return {
      ok: false,
      project: createEmptyPersistenceEnvelopeV761({ formatVersion: '' }),
      normalizedProject: createEmptyPersistenceEnvelopeV761({ formatVersion: '' }),
      errors: [{ code: 'QA-DATA-014', severity: 'BLOCKER', message: error?.message || 'Deserializer failed.', path: '$' }],
      warnings: [],
      qaFindings: [{ code: 'QA-DATA-014', severity: 'BLOCKER', message: error?.message || 'Deserializer failed.', path: '$' }],
    };
  }
}
