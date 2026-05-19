// LOSKOT FVE & LPS STUDIO PRO
// V173 Visible Shell Navigation Feed

import {
  VISIBLE_SHELL_READ_ONLY_ATTACHMENT_VERSION,
  createVisibleShellReadOnlyAttachment,
  validateVisibleShellReadOnlyAttachment
} from './visibleShellReadOnlyAttachmentV172.js';

export const VISIBLE_SHELL_NAVIGATION_FEED_VERSION = 'v173-visible-shell-navigation-feed';

export function createVisibleShellNavigationFeed(options = {}) {
  const attachment = createVisibleShellReadOnlyAttachment(options);
  const validation = validateVisibleShellReadOnlyAttachment(attachment);
  const modules = attachment.audit.gate.matrix.matrix;
  const navigationItems = modules.map((module, index) => ({
    order: index + 1,
    moduleId: module.moduleId,
    labelCs: module.moduleId,
    ready: module.hasRuntimeData && module.hasQaFeed,
    active: module.moduleId === attachment.audit.gate.matrix.binding.controller.readiness.manifest.bridge.aggregator.activeModuleId
  }));
  return {
    feedVersion: VISIBLE_SHELL_NAVIGATION_FEED_VERSION,
    attachmentVersion: VISIBLE_SHELL_READ_ONLY_ATTACHMENT_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    navigationItems,
    attachment,
    qa: { ok: validation.ok && navigationItems.length === 13, itemCount: navigationItems.length, errors: validation.errors }
  };
}

export function validateVisibleShellNavigationFeed(feed = createVisibleShellNavigationFeed()) {
  const errors = [];
  if (feed.feedVersion !== VISIBLE_SHELL_NAVIGATION_FEED_VERSION) errors.push('Unexpected V173 version.');
  if (feed.visualMutationAllowed !== false) errors.push('V173 must not allow visual mutation.');
  if (!Array.isArray(feed.navigationItems) || feed.navigationItems.length !== 13) errors.push('V173 navigation count must be 13.');
  if (!feed.qa || feed.qa.ok !== true) errors.push('V173 QA is not OK.');
  return { ok: errors.length === 0, version: feed.feedVersion, itemCount: feed.navigationItems?.length || 0, errors };
}
