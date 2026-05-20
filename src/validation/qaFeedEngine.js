'use strict';

const SEVERITY_ORDER = {
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  BLOCKER: 3,
};

const FORBIDDEN_TERMS = ['Veolia', 'FQ1', 'S01BHE03', 'DA'];

export function createQaFinding(code, severity, message, details) {
  const normalizedSeverity = SEVERITY_ORDER[severity] === undefined ? 'INFO' : severity;
  return {
    code,
    severity: normalizedSeverity,
    source: details && details.source ? details.source : 'QA_FEED',
    message,
    details: details || {},
  };
}

function walkStrings(value, path, visitor) {
  if (typeof value === 'string') {
    visitor(value, path);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkStrings(item, `${path}[${index}]`, visitor));
    return;
  }
  if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => walkStrings(value[key], path ? `${path}.${key}` : key, visitor));
  }
}

function containsForbiddenTerm(text, term) {
  if (term === 'DA') {
    return /\bDA\b/.test(text);
  }
  return text.includes(term);
}

function findForbiddenContent(payload) {
  const findings = [];
  walkStrings(payload, '', (text, path) => {
    FORBIDDEN_TERMS.forEach((term) => {
      if (containsForbiddenTerm(text, term)) {
        findings.push(createQaFinding('BLK-005', 'BLOCKER', 'Forbidden external project content guard triggered.', {
          path,
          term,
        }));
      }
    });
  });
  return findings;
}

export function summarizeQaFindings(findings) {
  const list = Array.isArray(findings) ? findings : [];
  const bySeverity = { INFO: 0, WARN: 0, ERROR: 0, BLOCKER: 0 };
  const byCode = {};

  list.forEach((finding) => {
    const severity = finding && bySeverity[finding.severity] !== undefined ? finding.severity : 'INFO';
    bySeverity[severity] += 1;
    if (finding && finding.code) {
      byCode[finding.code] = (byCode[finding.code] || 0) + 1;
    }
  });

  return {
    total: list.length,
    bySeverity,
    byCode,
    releaseGo: bySeverity.ERROR === 0 && bySeverity.BLOCKER === 0,
  };
}

export function runQaFeed(input) {
  const data = input || {};
  const findings = []
    .concat(Array.isArray(data.fveFindings) ? data.fveFindings : [])
    .concat(Array.isArray(data.spdFindings) ? data.spdFindings : [])
    .concat(Array.isArray(data.lpsFindings) ? data.lpsFindings : [])
    .concat(Array.isArray(data.findings) ? data.findings : []);

  findings.push(...findForbiddenContent(data.projectContent || data.project || data.payload || {}));

  const qaSummary = summarizeQaFindings(findings);
  return {
    qaFindings: findings,
    qaSummary,
    releaseGo: qaSummary.releaseGo,
  };
}
