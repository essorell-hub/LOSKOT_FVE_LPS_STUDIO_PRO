// LOSKOT FVE & LPS STUDIO PRO
// V165 App Readiness Model

import {
  EXPORT_PACKAGE_MANIFEST_VERSION,
  createExportPackageManifest,
  validateExportPackageManifest
} from './exportPackageManifestV164.js';

export const APP_READINESS_MODEL_VERSION = 'v165-app-readiness-model';

export function createAppReadinessModel(options = {}) {
  const manifest = createExportPackageManifest({ activeRouteKey: options.activeRouteKey, projectContext: options.projectContext });
  const manifestValidation = validateExportPackageManifest(manifest);

  const readiness = [
    { key: 'runtime-shell', labelCs: 'Runtime shell', ok: true },
    { key: 'state-connector', labelCs: 'State connector', ok: true },
    { key: 'module-registry', labelCs: 'Module registry', ok: manifest.bridge.aggregator.router.registry.qa.ok },
    { key: 'workspace-router', labelCs: 'Workspace router', ok: manifest.bridge.aggregator.router.qa.ok },
    { key: 'qa-aggregator', labelCs: 'QA aggregator', ok: manifest.bridge.aggregator.qa.ok },
    { key: 'persistence-bridge', labelCs: 'Persistence bridge', ok: manifest.bridge.qa.ok },
    { key: 'export-manifest', labelCs: 'Export manifest', ok: manifest.qa.ok },
    { key: 'visual-lock', labelCs: 'Visual lock', ok: manifest.visualMutationAllowed === false }
  ];

  const failed = readiness.filter((item) => item.ok !== true);

  return {
    readinessVersion: APP_READINESS_MODEL_VERSION,
    exportManifestVersion: EXPORT_PACKAGE_MANIFEST_VERSION,
    ready: manifestValidation.ok && failed.length === 0,
    visualMutationAllowed: false,
    status: failed.length === 0 ? 'READY' : 'BLOCKED',
    projectIdentity: manifest.projectIdentity,
    readiness,
    manifest,
    qa: {
      ok: manifestValidation.ok && failed.length === 0,
      readinessCount: readiness.length,
      failedCount: failed.length,
      errors: [...manifestValidation.errors, ...failed.map((item) => item.key)]
    }
  };
}

export function validateAppReadinessModel(model = createAppReadinessModel()) {
  const errors = [];
  if (model.readinessVersion !== APP_READINESS_MODEL_VERSION) errors.push('Unexpected V165 readiness model version.');
  if (model.exportManifestVersion !== EXPORT_PACKAGE_MANIFEST_VERSION) errors.push('Unexpected V164 export manifest version.');
  if (model.visualMutationAllowed !== false) errors.push('Readiness model must not allow visual mutation.');
  if (!Array.isArray(model.readiness) || model.readiness.length !== 8) errors.push('Readiness model must contain 8 checks.');
  if (!model.qa || model.qa.ok !== true) errors.push('App readiness QA is not OK.');
  return { ok: errors.length === 0, readinessVersion: model.readinessVersion, status: model.status, readinessCount: model.readiness?.length || 0, failedCount: model.qa?.failedCount ?? null, errors };
}
