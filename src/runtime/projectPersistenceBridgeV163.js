// LOSKOT FVE & LPS STUDIO PRO
// V163 Project Persistence Bridge

import {
  QA_RUNTIME_AGGREGATOR_VERSION,
  createQaRuntimeAggregator,
  validateQaRuntimeAggregator
} from './qaRuntimeAggregatorV162.js';

export const PROJECT_PERSISTENCE_BRIDGE_VERSION = 'v163-project-persistence-bridge';

export function createProjectPersistenceBridge(options = {}) {
  const aggregator = createQaRuntimeAggregator({ activeRouteKey: options.activeRouteKey, projectContext: options.projectContext });
  const aggregatorValidation = validateQaRuntimeAggregator(aggregator);
  const project = options.projectContext || aggregator.router.registry.feed.projectContext || {};

  return {
    bridgeVersion: PROJECT_PERSISTENCE_BRIDGE_VERSION,
    aggregatorVersion: QA_RUNTIME_AGGREGATOR_VERSION,
    ready: aggregatorValidation.ok,
    visualMutationAllowed: false,
    activeRouteKey: aggregator.activeRouteKey,
    persistenceContract: {
      format: 'loskot-project-json',
      canImportJson: true,
      canExportJson: true,
      canCreateSnapshot: true,
      canRestoreSnapshot: true,
      visualMutationAllowed: false
    },
    projectIdentity: {
      projectId: project.projectId || 'LOSKOT-DEMO-PROJECT',
      projectName: project.projectName || 'LOSKOT FVE & LPS Studio PRO – interní zakázka',
      revision: project.revision || 'pracovní'
    },
    aggregator,
    qa: {
      ok: aggregatorValidation.ok,
      persistenceReady: true,
      errors: aggregatorValidation.errors
    }
  };
}

export function validateProjectPersistenceBridge(bridge = createProjectPersistenceBridge()) {
  const errors = [];
  if (bridge.bridgeVersion !== PROJECT_PERSISTENCE_BRIDGE_VERSION) errors.push('Unexpected V163 persistence bridge version.');
  if (bridge.aggregatorVersion !== QA_RUNTIME_AGGREGATOR_VERSION) errors.push('Unexpected V162 aggregator version.');
  if (bridge.visualMutationAllowed !== false) errors.push('Persistence bridge must not allow visual mutation.');
  if (!bridge.persistenceContract || bridge.persistenceContract.canImportJson !== true || bridge.persistenceContract.canExportJson !== true) errors.push('Persistence contract is incomplete.');
  if (!bridge.qa || bridge.qa.ok !== true) errors.push('Persistence bridge QA is not OK.');
  return { ok: errors.length === 0, bridgeVersion: bridge.bridgeVersion, activeRouteKey: bridge.activeRouteKey, projectId: bridge.projectIdentity?.projectId || null, errors };
}
