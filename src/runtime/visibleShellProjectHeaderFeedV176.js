// LOSKOT FVE & LPS STUDIO PRO
// V176 Visible Shell Project Header Feed

import {
  VISIBLE_SHELL_QA_FEED_VERSION,
  createVisibleShellQaFeed,
  validateVisibleShellQaFeed
} from './visibleShellQaFeedV175.js';

export const VISIBLE_SHELL_PROJECT_HEADER_FEED_VERSION = 'v176-visible-shell-project-header-feed';

export function createVisibleShellProjectHeaderFeed(options = {}) {
  const qaFeed = createVisibleShellQaFeed(options);
  const validation = validateVisibleShellQaFeed(qaFeed);
  const project = qaFeed.workspace.navigation.attachment.audit.snapshot.projectIdentity || {};
  return {
    feedVersion: VISIBLE_SHELL_PROJECT_HEADER_FEED_VERSION,
    qaFeedVersion: VISIBLE_SHELL_QA_FEED_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    header: {
      projectId: project.projectId || 'UNKNOWN',
      projectName: project.projectName || 'LOSKOT projekt',
      revision: project.revision || 'pracovní',
      readOnly: true
    },
    qaFeed,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellProjectHeaderFeed(feed = createVisibleShellProjectHeaderFeed()) {
  const errors = [];
  if (feed.feedVersion !== VISIBLE_SHELL_PROJECT_HEADER_FEED_VERSION) errors.push('Unexpected V176 version.');
  if (feed.visualMutationAllowed !== false) errors.push('V176 must not allow visual mutation.');
  if (!feed.header || feed.header.readOnly !== true) errors.push('V176 header must be read-only.');
  if (!feed.qa || feed.qa.ok !== true) errors.push('V176 QA is not OK.');
  return { ok: errors.length === 0, version: feed.feedVersion, projectId: feed.header?.projectId || null, errors };
}
