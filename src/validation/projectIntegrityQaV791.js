import {
  PROJECT_PERSISTENCE_FOREIGN_CONTENT_TERMS_V761,
  PROJECT_PERSISTENCE_FORMAT_VERSION_V761,
  PROJECT_PERSISTENCE_QA_CODES_V761,
  createPersistenceQaFindingV761,
  isPlainObjectV761,
} from '../database/projectPersistenceContractV761.js';

function addFinding(findings, code, severity, message, path = '', details = {}) {
  findings.push(createPersistenceQaFindingV761({ code, severity, message, path, details }));
}

function walkData(value, visitor, path = '$', seen = new Set()) {
  if (value === null || value === undefined) return;
  visitor(value, path);
  if (typeof value === 'string') {
    return;
  }
  if (typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item, index) => walkData(item, visitor, `${path}[${index}]`, seen));
    return;
  }

  Object.entries(value).forEach(([key, item]) => {
    walkData(item, visitor, `${path}.${key}`, seen);
  });
}

function hasPlaceholderSignal(key, value) {
  if (typeof key === 'string' && key.toLowerCase().includes('placeholder')) return true;
  if (typeof value === 'string' && value.toLowerCase().includes('placeholder')) return true;
  if (isPlainObjectV761(value) && value.placeholder === true) return true;
  return false;
}

export function runProjectIntegrityQaV791(payload = {}) {
  const findings = [];
  const source = isPlainObjectV761(payload) ? payload : {};

  if (!source.projectId) {
    addFinding(findings, PROJECT_PERSISTENCE_QA_CODES_V761.missingProjectId, 'BLOCKER', 'Missing projectId.', '$.projectId');
  }

  if (!source.projectName) {
    addFinding(findings, PROJECT_PERSISTENCE_QA_CODES_V761.missingProjectName, 'BLOCKER', 'Missing projectName.', '$.projectName');
  }

  if (!source.formatVersion) {
    addFinding(findings, PROJECT_PERSISTENCE_QA_CODES_V761.missingFormatVersion, 'BLOCKER', 'Missing formatVersion.', '$.formatVersion');
  } else if (source.formatVersion !== PROJECT_PERSISTENCE_FORMAT_VERSION_V761) {
    addFinding(findings, PROJECT_PERSISTENCE_QA_CODES_V761.invalidFormatVersion, 'BLOCKER', 'Invalid formatVersion.', '$.formatVersion', {
      expected: PROJECT_PERSISTENCE_FORMAT_VERSION_V761,
      actual: source.formatVersion,
    });
  }

  if (!isPlainObjectV761(source.unifiedProject)) {
    addFinding(findings, PROJECT_PERSISTENCE_QA_CODES_V761.missingUnifiedProject, 'BLOCKER', 'Missing unifiedProject.', '$.unifiedProject');
  }

  if (!isPlainObjectV761(source.exportManifest)) {
    addFinding(findings, PROJECT_PERSISTENCE_QA_CODES_V761.missingExportManifest, 'BLOCKER', 'Missing exportManifest.', '$.exportManifest');
  }

  if (!isPlainObjectV761(source.qaSummary)) {
    addFinding(findings, PROJECT_PERSISTENCE_QA_CODES_V761.missingQaSummary, 'WARNING', 'Missing qaSummary.', '$.qaSummary');
  }

  if (!isPlainObjectV761(source)) {
    addFinding(findings, PROJECT_PERSISTENCE_QA_CODES_V761.schemaDrift, 'BLOCKER', 'Payload is not an object.', '$');
  }

  walkData(source, (value, path) => {
    if (typeof value !== 'string') return;
    const foundTerm = PROJECT_PERSISTENCE_FOREIGN_CONTENT_TERMS_V761.find((term) => value.includes(term));
    if (foundTerm) {
      addFinding(findings, PROJECT_PERSISTENCE_QA_CODES_V761.foreignProjectContent, 'BLOCKER', 'Foreign project content guard matched.', path, {
        term: foundTerm,
      });
    }
  });

  walkData(source, (value, path) => {
    if (!isPlainObjectV761(value)) return;
    Object.entries(value).forEach(([key, childValue]) => {
      if (!hasPlaceholderSignal(key, childValue)) return;
      const marker = isPlainObjectV761(childValue) ? childValue : value;
      if (!(marker.isPlaceholder === true && marker.normative === false)) {
        addFinding(
          findings,
          PROJECT_PERSISTENCE_QA_CODES_V761.unmarkedPlaceholder,
          'BLOCKER',
          'Placeholder calculation is not marked as non-normative placeholder.',
          `${path}.${key}`,
        );
      }
    });
  });

  return {
    ok: !findings.some((finding) => finding.severity === 'BLOCKER'),
    qaFindings: findings,
    errors: findings.filter((finding) => finding.severity === 'BLOCKER'),
    warnings: findings.filter((finding) => finding.severity !== 'BLOCKER'),
  };
}
