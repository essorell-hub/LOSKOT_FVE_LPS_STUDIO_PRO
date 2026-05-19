// LOSKOT FVE & LPS STUDIO PRO
// V159 FAST QA Panel Runtime Feed
//
// QA feed contract for runtime shell/project context. No visual mutation.

import {
  PROJECT_CONTEXT_BRIDGE_VERSION,
  createProjectContextBridge,
  getProjectContextShellSummary,
  validateProjectContextBridge
} from './projectContextBridgeV158.js';

export const QA_PANEL_RUNTIME_FEED_VERSION = 'v159-fast-qa-panel-runtime-feed';

export const QA_PANEL_FEED_LEVELS = Object.freeze({
  OK: 'OK',
  WARNING: 'WARNING',
  BLOCKED: 'BLOCKED'
});

export function createQaPanelRuntimeFeed(options = {}) {
  const bridge = createProjectContextBridge({
    activeRouteKey: options.activeRouteKey,
    projectContext: options.projectContext
  });
  const bridgeValidation = validateProjectContextBridge(bridge);
  const summary = getProjectContextShellSummary(bridge);

  const feedItems = [
    {
      key: 'ui-baseline',
      labelCs: 'Schválený Classic PRO vzhled uzamčen',
      level: QA_PANEL_FEED_LEVELS.OK,
      ok: bridge.visualMutationAllowed === false
    },
    {
      key: 'runtime-action-dispatcher',
      labelCs: 'Runtime action dispatcher připraven',
      level: bridge.qa.dispatcherOk ? QA_PANEL_FEED_LEVELS.OK : QA_PANEL_FEED_LEVELS.BLOCKED,
      ok: bridge.qa.dispatcherOk
    },
    {
      key: 'project-context',
      labelCs: 'Projektový kontext dostupný',
      level: bridge.qa.projectContextPresent ? QA_PANEL_FEED_LEVELS.OK : QA_PANEL_FEED_LEVELS.BLOCKED,
      ok: bridge.qa.projectContextPresent
    },
    {
      key: 'active-route',
      labelCs: 'Aktivní obrazovka napojena',
      level: bridge.qa.routeActionOk ? QA_PANEL_FEED_LEVELS.OK : QA_PANEL_FEED_LEVELS.BLOCKED,
      ok: bridge.qa.routeActionOk
    }
  ];

  const blocked = feedItems.filter((item) => item.ok !== true);

  return {
    feedVersion: QA_PANEL_RUNTIME_FEED_VERSION,
    bridgeVersion: PROJECT_CONTEXT_BRIDGE_VERSION,
    ready: bridgeValidation.ok && blocked.length === 0,
    visualMutationAllowed: false,
    activeRouteKey: bridge.activeRouteKey,
    activeScreen: bridge.activeScreen,
    projectContext: bridge.projectContext,
    shellSummary: summary,
    feedItems,
    status: blocked.length === 0 ? QA_PANEL_FEED_LEVELS.OK : QA_PANEL_FEED_LEVELS.BLOCKED,
    qa: {
      ok: bridgeValidation.ok && blocked.length === 0,
      itemCount: feedItems.length,
      blockedCount: blocked.length,
      bridgeOk: bridgeValidation.ok,
      errors: bridgeValidation.errors
    }
  };
}

export function validateQaPanelRuntimeFeed(feed = createQaPanelRuntimeFeed()) {
  const errors = [];

  if (feed.feedVersion !== QA_PANEL_RUNTIME_FEED_VERSION) {
    errors.push('Unexpected V159 feed version.');
  }

  if (feed.bridgeVersion !== PROJECT_CONTEXT_BRIDGE_VERSION) {
    errors.push('Unexpected V158 bridge version.');
  }

  if (feed.visualMutationAllowed !== false) {
    errors.push('QA panel runtime feed must not allow visual mutation.');
  }

  if (!Array.isArray(feed.feedItems) || feed.feedItems.length !== 4) {
    errors.push('QA feed must contain 4 core feed items.');
  }

  if (!feed.qa || feed.qa.ok !== true) {
    errors.push('QA feed status is not OK.');
  }

  return {
    ok: errors.length === 0,
    feedVersion: feed.feedVersion,
    activeRouteKey: feed.activeRouteKey,
    itemCount: feed.feedItems ? feed.feedItems.length : 0,
    blockedCount: feed.qa ? feed.qa.blockedCount : null,
    errors
  };
}
