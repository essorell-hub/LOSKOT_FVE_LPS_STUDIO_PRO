'use strict';

import { createQaFinding, runQaFeed } from '../validation/qaFeedEngine.js';

const SECTION_DEFAULTS = {
  project: {},
  building: {},
  roof: {},
  fve: {},
  lps: {},
  spd: {},
  grounding: {},
  documents: [],
  export: {},
};

function cloneDefault(value) {
  return Array.isArray(value) ? [] : Object.assign({}, value);
}

export function createDefaultProjectInput(overrides) {
  const base = {};
  Object.keys(SECTION_DEFAULTS).forEach((key) => {
    base[key] = cloneDefault(SECTION_DEFAULTS[key]);
  });
  return normalizeProjectInput(Object.assign(base, overrides || {}));
}

export function normalizeProjectInput(input) {
  const data = input || {};
  const normalized = {};

  Object.keys(SECTION_DEFAULTS).forEach((key) => {
    if (Array.isArray(SECTION_DEFAULTS[key])) {
      normalized[key] = Array.isArray(data[key]) ? data[key] : [];
    } else {
      normalized[key] = Object.assign({}, SECTION_DEFAULTS[key], data[key] || {});
    }
  });

  return normalized;
}

export function validateProjectInput(input) {
  const normalized = normalizeProjectInput(input);
  const findings = [];

  if (!normalized.project.projectId) {
    findings.push(createQaFinding('PROJECT-REQ-001', 'ERROR', 'Missing required projectId.', {
      field: 'project.projectId',
      source: 'PROJECT_INPUT_CONTRACT',
    }));
  }

  if (!normalized.project.projectName) {
    findings.push(createQaFinding('PROJECT-REQ-002', 'ERROR', 'Missing required projectName.', {
      field: 'project.projectName',
      source: 'PROJECT_INPUT_CONTRACT',
    }));
  }

  const guardResult = runQaFeed({ project: normalized });
  findings.push(...guardResult.qaFindings);

  return {
    valid: findings.every((finding) => finding.severity !== 'ERROR' && finding.severity !== 'BLOCKER'),
    normalized,
    findings,
  };
}
