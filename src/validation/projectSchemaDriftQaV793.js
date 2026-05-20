import {
  PROJECT_PERSISTENCE_QA_CODES_V761,
  createPersistenceQaFindingV761,
  isPlainObjectV761,
} from '../database/projectPersistenceContractV761.js';

export function runProjectSchemaDriftQaV793(payload = {}) {
  const findings = [];
  const unifiedProject = payload?.unifiedProject;
  const checks = [
    ['$.unifiedProject.project', unifiedProject?.project || unifiedProject?.projectInfo],
    ['$.unifiedProject.building', unifiedProject?.building],
    ['$.unifiedProject.fve', unifiedProject?.fve || unifiedProject?.fveModule],
    ['$.unifiedProject.lps', unifiedProject?.lps || unifiedProject?.lpsModule],
    ['$.unifiedProject.spd', unifiedProject?.spd || unifiedProject?.spdModule],
    ['$.unifiedProject.grounding', unifiedProject?.grounding || unifiedProject?.groundingModule],
    ['$.documents', payload?.documents],
    ['$.exportManifest', payload?.exportManifest],
  ];

  checks.forEach(([path, value]) => {
    const valid = Array.isArray(value) || isPlainObjectV761(value);
    if (!valid) {
      findings.push(createPersistenceQaFindingV761({
        code: PROJECT_PERSISTENCE_QA_CODES_V761.schemaDrift,
        severity: path === '$.documents' ? 'WARNING' : 'BLOCKER',
        message: 'Expected minimal persistence structure is missing or has an unknown shape.',
        path,
      }));
    }
  });

  return {
    ok: !findings.some((finding) => finding.severity === 'BLOCKER'),
    qaFindings: findings,
    errors: findings.filter((finding) => finding.severity === 'BLOCKER'),
    warnings: findings.filter((finding) => finding.severity !== 'BLOCKER'),
  };
}
