'use strict';

import { createQaFinding, runQaFeed } from '../validation/qaFeedEngine.js';

function nowIso() {
  return new Date().toISOString();
}

export function createExportManifest(input) {
  const data = input || {};
  const qaSummary = data.qaSummary || runQaFeed({
    findings: data.qaFindings || [],
    project: data.project || {},
  }).qaSummary;

  return {
    projectId: data.projectId || (data.project && data.project.projectId) || '',
    projectName: data.projectName || (data.project && data.project.projectName) || '',
    version: data.version || 'V422-V484-working',
    generatedAt: data.generatedAt || nowIso(),
    modules: Array.isArray(data.modules) ? data.modules : [],
    documents: Array.isArray(data.documents) ? data.documents : [],
    bom: Array.isArray(data.bom) ? data.bom : [],
    qaSummary,
    files: Array.isArray(data.files) ? data.files : [],
    warnings: Array.isArray(data.warnings) ? data.warnings : [],
  };
}

export function validateExportManifest(manifest) {
  const data = manifest || {};
  const findings = [];

  ['projectId', 'projectName', 'version', 'generatedAt'].forEach((field) => {
    if (!data[field]) {
      findings.push(createQaFinding('MANIFEST-REQ-001', 'ERROR', `Missing manifest field: ${field}.`, {
        field,
        source: 'EXPORT_MANIFEST',
      }));
    }
  });

  ['modules', 'documents', 'bom', 'files', 'warnings'].forEach((field) => {
    if (!Array.isArray(data[field])) {
      findings.push(createQaFinding('MANIFEST-TYPE-001', 'ERROR', `Manifest field must be an array: ${field}.`, {
        field,
        source: 'EXPORT_MANIFEST',
      }));
    }
  });

  const guardResult = runQaFeed({ project: data });
  findings.push(...guardResult.qaFindings);

  return {
    valid: findings.every((finding) => finding.severity !== 'ERROR' && finding.severity !== 'BLOCKER'),
    findings,
  };
}
