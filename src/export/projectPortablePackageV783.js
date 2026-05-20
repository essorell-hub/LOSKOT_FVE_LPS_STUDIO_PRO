import { deepCloneV761, normalizeQaSummaryV761 } from '../database/projectPersistenceContractV761.js';

export function createProjectPortablePackageV783(projectPayload, options = {}) {
  const qaSummary = normalizeQaSummaryV761(options.qaSummary || projectPayload?.qaSummary);
  const blockers = qaSummary.qaFindings.filter((finding) => finding.severity === 'BLOCKER');
  return {
    packageVersion: 'LOSKOT_PORTABLE_PROJECT_PACKAGE_V783',
    generatedAt: options.generatedAt || projectPayload?.savedAt || new Date(0).toISOString(),
    projectPayload: deepCloneV761(projectPayload || {}),
    filePlan: {
      mode: 'offline-json',
      files: [
        {
          role: 'project-json',
          fileName: `${projectPayload?.projectId || 'project'}_loskot_project.json`,
          required: true,
        },
      ],
    },
    readiness: {
      ok: blockers.length === 0,
      blockers,
      warnings: qaSummary.warnings || [],
    },
    qaSummary,
  };
}
