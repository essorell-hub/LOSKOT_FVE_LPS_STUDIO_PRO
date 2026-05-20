import assert from 'node:assert/strict';
import { createRuntimeStore } from '../../src/runtime/projectRuntimeStoreV771.js';

const store = createRuntimeStore();
const loadResult = store.loadProjectToRuntime({
  projectId: 'LOS-RUNTIME-1',
  projectName: 'Runtime Store Test',
  unifiedProject: {
    project: { projectId: 'LOS-RUNTIME-1', projectName: 'Runtime Store Test' },
  },
});

assert.equal(loadResult.ok, true);
assert.equal(store.getCurrentProject().projectId, 'LOS-RUNTIME-1');

const updateResult = store.updateProjectSection('unifiedProject.fve', { strings: [{ id: 'PV-1' }] });
assert.equal(updateResult.ok, true);
assert.equal(store.getCurrentProject().unifiedProject.fve.strings[0].id, 'PV-1');

const snapshot = store.createRuntimeSnapshot({ createdAt: '2026-05-20T00:00:00.000Z' });
store.updateProjectSection('unifiedProject.fve', { strings: [{ id: 'PV-2' }] });
assert.equal(store.getCurrentProject().unifiedProject.fve.strings[0].id, 'PV-2');

const restoreResult = store.restoreRuntimeSnapshot(snapshot);
assert.equal(restoreResult.ok, true);
assert.equal(store.getCurrentProject().unifiedProject.fve.strings[0].id, 'PV-1');
assert.ok(store.getRuntimeChangeLog().length >= 4);

store.clearRuntimeStore();
assert.equal(store.getCurrentProject(), null);

console.log('V771_PROJECT_RUNTIME_STORE_TEST=PASS');
