// LOSKOT FVE & LPS STUDIO PRO
// V206 Visible Shell Attachment Registry

import { createAppShellRuntimeMilestone, validateAppShellRuntimeMilestone } from './appShellRuntimeMilestoneV205.js';

export const VISIBLE_SHELL_ATTACHMENT_REGISTRY_VERSION = 'v206-visible-shell-attachment-registry';

export function createVisibleShellAttachmentRegistry(options = {}) {
  const milestone = createAppShellRuntimeMilestone(options);
  const validation = validateAppShellRuntimeMilestone(milestone);
  const regions = [
    { id: 'left-navigation', attachable: true, readOnly: true },
    { id: 'central-workspace', attachable: true, readOnly: true },
    { id: 'right-qa-panel', attachable: true, readOnly: true },
    { id: 'project-inspector', attachable: true, readOnly: true },
    { id: 'status-footer', attachable: true, readOnly: true }
  ];
  return {
    registryVersion: VISIBLE_SHELL_ATTACHMENT_REGISTRY_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    regions,
    milestone,
    qa: { ok: validation.ok && regions.length === 5, regionCount: regions.length, errors: validation.errors }
  };
}

export function validateVisibleShellAttachmentRegistry(model = createVisibleShellAttachmentRegistry()) {
  const errors = [];
  if (model.registryVersion !== VISIBLE_SHELL_ATTACHMENT_REGISTRY_VERSION) errors.push('Unexpected V206 version.');
  if (model.visualMutationAllowed !== false) errors.push('V206 must not mutate visuals.');
  if (!Array.isArray(model.regions) || model.regions.length !== 5) errors.push('V206 region count must be 5.');
  if (!model.qa || model.qa.ok !== true) errors.push('V206 QA is not OK.');
  return { ok: errors.length === 0, version: model.registryVersion, regionCount: model.regions?.length || 0, errors };
}
