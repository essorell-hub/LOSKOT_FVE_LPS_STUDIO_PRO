// LOSKOT FVE & LPS STUDIO PRO
// V164 Export Package Manifest

import {
  PROJECT_PERSISTENCE_BRIDGE_VERSION,
  createProjectPersistenceBridge,
  validateProjectPersistenceBridge
} from './projectPersistenceBridgeV163.js';

export const EXPORT_PACKAGE_MANIFEST_VERSION = 'v164-export-package-manifest';

export function createExportPackageManifest(options = {}) {
  const bridge = createProjectPersistenceBridge({ activeRouteKey: options.activeRouteKey || 'exports', projectContext: options.projectContext });
  const bridgeValidation = validateProjectPersistenceBridge(bridge);
  const items = [
    { key: 'project-json', labelCs: 'Projekt JSON', required: true, ready: bridge.persistenceContract.canExportJson },
    { key: 'technical-report', labelCs: 'Technická zpráva', required: true, ready: true },
    { key: 'bill-of-materials', labelCs: 'Výkaz materiálu', required: true, ready: true },
    { key: 'qa-report', labelCs: 'QA report', required: true, ready: bridge.aggregator.qa.ok },
    { key: 'drawings-placeholder', labelCs: 'Schémata / výkresy', required: false, ready: true }
  ];

  const blocked = items.filter((item) => item.required && item.ready !== true);

  return {
    manifestVersion: EXPORT_PACKAGE_MANIFEST_VERSION,
    persistenceBridgeVersion: PROJECT_PERSISTENCE_BRIDGE_VERSION,
    ready: bridgeValidation.ok && blocked.length === 0,
    visualMutationAllowed: false,
    projectIdentity: bridge.projectIdentity,
    items,
    bridge,
    qa: {
      ok: bridgeValidation.ok && blocked.length === 0,
      itemCount: items.length,
      blockedCount: blocked.length,
      errors: [...bridgeValidation.errors, ...blocked.map((item) => item.key)]
    }
  };
}

export function validateExportPackageManifest(manifest = createExportPackageManifest()) {
  const errors = [];
  if (manifest.manifestVersion !== EXPORT_PACKAGE_MANIFEST_VERSION) errors.push('Unexpected V164 export manifest version.');
  if (manifest.persistenceBridgeVersion !== PROJECT_PERSISTENCE_BRIDGE_VERSION) errors.push('Unexpected V163 persistence bridge version.');
  if (manifest.visualMutationAllowed !== false) errors.push('Export manifest must not allow visual mutation.');
  if (!Array.isArray(manifest.items) || manifest.items.length !== 5) errors.push('Export manifest must contain 5 package items.');
  if (!manifest.qa || manifest.qa.ok !== true) errors.push('Export manifest QA is not OK.');
  return { ok: errors.length === 0, manifestVersion: manifest.manifestVersion, itemCount: manifest.items?.length || 0, blockedCount: manifest.qa?.blockedCount ?? null, errors };
}
