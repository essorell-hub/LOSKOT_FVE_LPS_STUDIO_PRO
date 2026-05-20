// LOSKOT FVE & LPS STUDIO PRO
// V174 Visible Shell Workspace Feed

import {
  VISIBLE_SHELL_NAVIGATION_FEED_VERSION,
  createVisibleShellNavigationFeed,
  validateVisibleShellNavigationFeed
} from './visibleShellNavigationFeedV173.js';

export const VISIBLE_SHELL_WORKSPACE_FEED_VERSION = 'v174-visible-shell-workspace-feed';

export function createVisibleShellWorkspaceFeed(options = {}) {
  const navigation = createVisibleShellNavigationFeed(options);
  const validation = validateVisibleShellNavigationFeed(navigation);
  const audit = navigation.attachment.audit;
  return {
    feedVersion: VISIBLE_SHELL_WORKSPACE_FEED_VERSION,
    navigationFeedVersion: VISIBLE_SHELL_NAVIGATION_FEED_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    workspace: {
      activeRouteKey: audit.snapshot.activeRouteKey,
      activeModuleCount: audit.snapshot.activeModuleCount,
      renderMode: 'read-only-data-feed',
      canModifyLayout: false,
      canModifyComponents: false
    },
    navigation,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellWorkspaceFeed(feed = createVisibleShellWorkspaceFeed()) {
  const errors = [];
  if (feed.feedVersion !== VISIBLE_SHELL_WORKSPACE_FEED_VERSION) errors.push('Unexpected V174 version.');
  if (feed.visualMutationAllowed !== false) errors.push('V174 must not allow visual mutation.');
  if (!feed.workspace || feed.workspace.canModifyLayout !== false || feed.workspace.canModifyComponents !== false) errors.push('V174 workspace contract unsafe.');
  if (!feed.qa || feed.qa.ok !== true) errors.push('V174 QA is not OK.');
  return { ok: errors.length === 0, version: feed.feedVersion, activeRouteKey: feed.workspace?.activeRouteKey || null, errors };
}
