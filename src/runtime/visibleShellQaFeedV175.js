// LOSKOT FVE & LPS STUDIO PRO
// V175 Visible Shell QA Feed

import {
  VISIBLE_SHELL_WORKSPACE_FEED_VERSION,
  createVisibleShellWorkspaceFeed,
  validateVisibleShellWorkspaceFeed
} from './visibleShellWorkspaceFeedV174.js';

export const VISIBLE_SHELL_QA_FEED_VERSION = 'v175-visible-shell-qa-feed';

export function createVisibleShellQaFeed(options = {}) {
  const workspace = createVisibleShellWorkspaceFeed(options);
  const validation = validateVisibleShellWorkspaceFeed(workspace);
  const audit = workspace.navigation.attachment.audit;
  const qaItems = [
    { key: 'runtime-audit', ok: audit.qa.ok },
    { key: 'release-gate', ok: audit.snapshot.releaseCandidateReady },
    { key: 'visual-lock', ok: audit.visualMutationAllowed === false },
    { key: 'workspace-feed', ok: validation.ok }
  ];
  const failed = qaItems.filter((item) => !item.ok);
  return {
    feedVersion: VISIBLE_SHELL_QA_FEED_VERSION,
    workspaceFeedVersion: VISIBLE_SHELL_WORKSPACE_FEED_VERSION,
    ready: failed.length === 0,
    visualMutationAllowed: false,
    qaItems,
    workspace,
    qa: { ok: failed.length === 0, itemCount: qaItems.length, failedCount: failed.length, errors: failed.map((item) => item.key) }
  };
}

export function validateVisibleShellQaFeed(feed = createVisibleShellQaFeed()) {
  const errors = [];
  if (feed.feedVersion !== VISIBLE_SHELL_QA_FEED_VERSION) errors.push('Unexpected V175 version.');
  if (feed.visualMutationAllowed !== false) errors.push('V175 must not allow visual mutation.');
  if (!Array.isArray(feed.qaItems) || feed.qaItems.length !== 4) errors.push('V175 QA item count must be 4.');
  if (!feed.qa || feed.qa.ok !== true) errors.push('V175 QA is not OK.');
  return { ok: errors.length === 0, version: feed.feedVersion, failedCount: feed.qa?.failedCount ?? null, errors };
}
