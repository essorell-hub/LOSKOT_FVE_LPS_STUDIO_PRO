export const PROJECT_PERSISTENCE_FORMAT_VERSION_V761 = 'LOSKOT_PROJECT_PERSISTENCE_V761';
export const PROJECT_PERSISTENCE_SOURCE_APP_V761 = 'LOSKOT_FVE_LPS_STUDIO_PRO';

export const PROJECT_PERSISTENCE_REQUIRED_FIELDS_V761 = [
  'formatVersion',
  'projectId',
  'projectName',
  'savedAt',
  'sourceApp',
  'unifiedProject',
  'documents',
  'bom',
  'qaSummary',
  'exportManifest',
  'metadata',
  'integrity',
];

export const PROJECT_PERSISTENCE_QA_CODES_V761 = Object.freeze({
  missingProjectId: 'QA-DATA-001',
  missingProjectName: 'QA-DATA-002',
  missingFormatVersion: 'QA-DATA-003',
  invalidFormatVersion: 'QA-DATA-004',
  missingUnifiedProject: 'QA-DATA-005',
  schemaDrift: 'QA-DATA-006',
  missingExportManifest: 'QA-DATA-007',
  missingQaSummary: 'QA-DATA-008',
  missingFveStringReference: 'QA-DATA-009',
  missingCadObjectReference: 'QA-DATA-010',
  missingLpsObjectReference: 'QA-DATA-011',
  foreignProjectContent: 'QA-DATA-012',
  unmarkedPlaceholder: 'QA-DATA-013',
  persistenceValidationFailed: 'QA-DATA-014',
  repositoryMissingCapability: 'QA-DATA-015',
});

export const PROJECT_PERSISTENCE_FOREIGN_CONTENT_TERMS_V761 = ['Veolia', 'FQ1', 'S01BHE03', 'DA'];

export function createPersistenceQaFindingV761({
  code,
  severity = 'WARNING',
  message,
  path = '',
  details = {},
} = {}) {
  return {
    code: code || PROJECT_PERSISTENCE_QA_CODES_V761.schemaDrift,
    severity,
    message: message || 'Persistence QA finding.',
    path,
    details,
  };
}

export function createEmptyPersistenceEnvelopeV761(overrides = {}) {
  return {
    formatVersion: PROJECT_PERSISTENCE_FORMAT_VERSION_V761,
    projectId: '',
    projectName: '',
    savedAt: '',
    sourceApp: PROJECT_PERSISTENCE_SOURCE_APP_V761,
    unifiedProject: {},
    documents: [],
    bom: {},
    qaSummary: { ok: true, errors: [], warnings: [], qaFindings: [] },
    exportManifest: { version: 'V761', artifacts: [] },
    metadata: {},
    integrity: {},
    ...overrides,
  };
}

export function isPlainObjectV761(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function deepCloneV761(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

export function stableStringifyV761(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringifyV761(item)).join(',')}]`;

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringifyV761(value[key])}`)
    .join(',')}}`;
}

export function createChecksumLikeFingerprintV761(value) {
  const source = stableStringifyV761(value);
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `v761-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function normalizeQaSummaryV761(input = {}) {
  const source = isPlainObjectV761(input) ? input : {};
  const errors = Array.isArray(source.errors) ? source.errors : [];
  const warnings = Array.isArray(source.warnings) ? source.warnings : [];
  const qaFindings = Array.isArray(source.qaFindings) ? source.qaFindings : [];
  return {
    ok: errors.length === 0 && !qaFindings.some((finding) => finding?.severity === 'BLOCKER'),
    errors,
    warnings,
    qaFindings,
  };
}
