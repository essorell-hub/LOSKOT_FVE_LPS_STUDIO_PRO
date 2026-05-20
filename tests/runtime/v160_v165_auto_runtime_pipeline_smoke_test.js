import assert from 'node:assert/strict';
import { createModuleRuntimeRegistry, resolveModuleForRoute, validateModuleRuntimeRegistry } from '../../src/runtime/moduleRuntimeRegistryV160.js';
import { createWorkspaceRuntimeRouter, validateWorkspaceRuntimeRouter } from '../../src/runtime/workspaceRuntimeRouterV161.js';
import { createQaRuntimeAggregator, validateQaRuntimeAggregator } from '../../src/runtime/qaRuntimeAggregatorV162.js';
import { createProjectPersistenceBridge, validateProjectPersistenceBridge } from '../../src/runtime/projectPersistenceBridgeV163.js';
import { createExportPackageManifest, validateExportPackageManifest } from '../../src/runtime/exportPackageManifestV164.js';
import { createAppReadinessModel, validateAppReadinessModel } from '../../src/runtime/appReadinessModelV165.js';

console.log('Starting V160-V165 AUTO FAST Runtime Pipeline smoke test...');

const projectContext = {
  projectId: 'PIPELINE-PROJECT-001',
  projectName: 'Pipeline projekt V160-V165',
  revision: 'test'
};

const registry = createModuleRuntimeRegistry({ activeRouteKey: 'fve-2d-layout', projectContext });
assert.equal(registry.ready, true);
assert.equal(registry.visualMutationAllowed, false);
assert.equal(registry.modules.length, 13);
assert.equal(validateModuleRuntimeRegistry(registry).ok, true);

const moduleResolution = resolveModuleForRoute('fve-2d-layout', registry);
assert.equal(moduleResolution.moduleId, 'fve');
assert.equal(moduleResolution.moduleReady, true);

const router = createWorkspaceRuntimeRouter({ activeRouteKey: 'documents', projectContext });
assert.equal(router.ready, true);
assert.equal(router.activeModuleId, 'documents');
assert.equal(router.workspacePayload.approvedVisualMutation, false);
assert.equal(validateWorkspaceRuntimeRouter(router).ok, true);

const aggregator = createQaRuntimeAggregator({ activeRouteKey: 'reports-statements', projectContext });
assert.equal(aggregator.ready, true);
assert.equal(aggregator.checks.length, 5);
assert.equal(aggregator.qa.failedCount, 0);
assert.equal(validateQaRuntimeAggregator(aggregator).ok, true);

const persistence = createProjectPersistenceBridge({ activeRouteKey: 'database', projectContext });
assert.equal(persistence.ready, true);
assert.equal(persistence.persistenceContract.canImportJson, true);
assert.equal(persistence.persistenceContract.canExportJson, true);
assert.equal(persistence.visualMutationAllowed, false);
assert.equal(validateProjectPersistenceBridge(persistence).ok, true);

const manifest = createExportPackageManifest({ activeRouteKey: 'exports', projectContext });
assert.equal(manifest.ready, true);
assert.equal(manifest.items.length, 5);
assert.equal(manifest.qa.blockedCount, 0);
assert.equal(validateExportPackageManifest(manifest).ok, true);

const readiness = createAppReadinessModel({ activeRouteKey: 'dashboard', projectContext });
assert.equal(readiness.ready, true);
assert.equal(readiness.status, 'READY');
assert.equal(readiness.readiness.length, 8);
assert.equal(readiness.qa.failedCount, 0);
const readinessValidation = validateAppReadinessModel(readiness);
assert.equal(readinessValidation.ok, true);
assert.equal(readinessValidation.errors.length, 0);

console.log('V160-V165 AUTO FAST Runtime Pipeline smoke test passed:', JSON.stringify({
  registry: validateModuleRuntimeRegistry(registry),
  router: validateWorkspaceRuntimeRouter(router),
  aggregator: validateQaRuntimeAggregator(aggregator),
  persistence: validateProjectPersistenceBridge(persistence),
  manifest: validateExportPackageManifest(manifest),
  readiness: readinessValidation
}, null, 2));
