import assert from 'node:assert/strict';
import {
  RUNTIME_ACTION_DISPATCHER_VERSION,
  RUNTIME_ACTION_TYPES,
  createRuntimeActionDispatcher,
  dispatchRuntimeAction,
  validateRuntimeActionDispatcher
} from '../../src/runtime/runtimeActionDispatcherV157.js';
import {
  PROJECT_CONTEXT_BRIDGE_VERSION,
  createProjectContextBridge,
  getProjectContextShellSummary,
  validateProjectContextBridge
} from '../../src/runtime/projectContextBridgeV158.js';
import {
  QA_PANEL_RUNTIME_FEED_VERSION,
  QA_PANEL_FEED_LEVELS,
  createQaPanelRuntimeFeed,
  validateQaPanelRuntimeFeed
} from '../../src/runtime/qaPanelRuntimeFeedV159.js';

console.log('Starting V157-V159 FAST Runtime Minipack smoke test...');

const dispatcher = createRuntimeActionDispatcher({ activeRouteKey: 'dashboard' });
assert.equal(dispatcher.dispatcherVersion, RUNTIME_ACTION_DISPATCHER_VERSION);
assert.equal(dispatcher.ready, true);
assert.equal(dispatcher.visualMutationAllowed, false);
assert.equal(dispatcher.supportedActions.length, 4);

const dispatch = dispatchRuntimeAction({
  type: RUNTIME_ACTION_TYPES.SET_ACTIVE_ROUTE,
  routeKey: 'documents'
});
assert.equal(dispatch.ok, true);
assert.equal(dispatch.resolvedRouteKey, 'documents');
assert.equal(dispatch.visualMutationAllowed, false);

const dispatcherValidation = validateRuntimeActionDispatcher(dispatcher);
assert.equal(dispatcherValidation.ok, true);
assert.equal(dispatcherValidation.errors.length, 0);

const bridge = createProjectContextBridge({
  activeRouteKey: 'documents',
  projectContext: {
    projectId: 'TEST-PROJECT-001',
    projectName: 'Testovací projekt V158'
  }
});
assert.equal(bridge.bridgeVersion, PROJECT_CONTEXT_BRIDGE_VERSION);
assert.equal(bridge.ready, true);
assert.equal(bridge.visualMutationAllowed, false);
assert.equal(bridge.activeRouteKey, 'documents');
assert.equal(bridge.projectContext.projectId, 'TEST-PROJECT-001');

const bridgeSummary = getProjectContextShellSummary(bridge);
assert.equal(bridgeSummary.ready, true);
assert.equal(bridgeSummary.activeRouteKey, 'documents');
assert.equal(bridgeSummary.visualMutationAllowed, false);

const bridgeValidation = validateProjectContextBridge(bridge);
assert.equal(bridgeValidation.ok, true);
assert.equal(bridgeValidation.errors.length, 0);

const feed = createQaPanelRuntimeFeed({
  activeRouteKey: 'reports-statements',
  projectContext: {
    projectId: 'QA-PROJECT-001',
    projectName: 'QA projekt V159'
  }
});
assert.equal(feed.feedVersion, QA_PANEL_RUNTIME_FEED_VERSION);
assert.equal(feed.ready, true);
assert.equal(feed.visualMutationAllowed, false);
assert.equal(feed.activeRouteKey, 'reports-statements');
assert.equal(feed.status, QA_PANEL_FEED_LEVELS.OK);
assert.equal(feed.feedItems.length, 4);
assert.equal(feed.qa.blockedCount, 0);

const feedValidation = validateQaPanelRuntimeFeed(feed);
assert.equal(feedValidation.ok, true);
assert.equal(feedValidation.feedVersion, QA_PANEL_RUNTIME_FEED_VERSION);
assert.equal(feedValidation.itemCount, 4);
assert.equal(feedValidation.errors.length, 0);

console.log('V157-V159 FAST Runtime Minipack smoke test passed:', JSON.stringify({
  dispatcher: dispatcherValidation,
  bridge: bridgeValidation,
  feed: feedValidation
}, null, 2));
