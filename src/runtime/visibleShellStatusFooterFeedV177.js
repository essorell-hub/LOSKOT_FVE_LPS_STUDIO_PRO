// LOSKOT FVE & LPS STUDIO PRO
// V177 Visible Shell Status Footer Feed

import {
  VISIBLE_SHELL_PROJECT_HEADER_FEED_VERSION,
  createVisibleShellProjectHeaderFeed,
  validateVisibleShellProjectHeaderFeed
} from './visibleShellProjectHeaderFeedV176.js';

export const VISIBLE_SHELL_STATUS_FOOTER_FEED_VERSION = 'v177-visible-shell-status-footer-feed';

export function createVisibleShellStatusFooterFeed(options = {}) {
  const headerFeed = createVisibleShellProjectHeaderFeed(options);
  const validation = validateVisibleShellProjectHeaderFeed(headerFeed);
  return {
    feedVersion: VISIBLE_SHELL_STATUS_FOOTER_FEED_VERSION,
    headerFeedVersion: VISIBLE_SHELL_PROJECT_HEADER_FEED_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    footer: {
      status: validation.ok ? 'READY' : 'BLOCKED',
      activeRouteKey: headerFeed.qaFeed.workspace.workspace.activeRouteKey,
      qaFailedCount: headerFeed.qaFeed.qa.failedCount,
      readOnly: true
    },
    headerFeed,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellStatusFooterFeed(feed = createVisibleShellStatusFooterFeed()) {
  const errors = [];
  if (feed.feedVersion !== VISIBLE_SHELL_STATUS_FOOTER_FEED_VERSION) errors.push('Unexpected V177 version.');
  if (feed.visualMutationAllowed !== false) errors.push('V177 must not allow visual mutation.');
  if (!feed.footer || feed.footer.readOnly !== true) errors.push('V177 footer must be read-only.');
  if (!feed.qa || feed.qa.ok !== true) errors.push('V177 QA is not OK.');
  return { ok: errors.length === 0, version: feed.feedVersion, status: feed.footer?.status || null, errors };
}
