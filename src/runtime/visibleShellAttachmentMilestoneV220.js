// LOSKOT FVE & LPS STUDIO PRO
// V220 Visible Shell Attachment Milestone

import { createVisibleShellAttachmentReleaseGate, validateVisibleShellAttachmentReleaseGate } from './visibleShellAttachmentReleaseGateV219.js';

export const VISIBLE_SHELL_ATTACHMENT_MILESTONE_VERSION = 'v220-visible-shell-attachment-milestone';

export function createVisibleShellAttachmentMilestone(options = {}) {
  const releaseGate = createVisibleShellAttachmentReleaseGate(options);
  const validation = validateVisibleShellAttachmentReleaseGate(releaseGate);
  return {
    milestoneVersion: VISIBLE_SHELL_ATTACHMENT_MILESTONE_VERSION,
    status: validation.ok ? 'READY_FOR_CONTROLLED_APP_INTEGRATION' : 'BLOCKED',
    ready: validation.ok,
    visualMutationAllowed: false,
    committedScope: 'safe-visible-shell-attachment-models-only',
    nextRecommendedStep: 'V221-V240 controlled app integration bridge',
    releaseGate,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellAttachmentMilestone(model = createVisibleShellAttachmentMilestone()) {
  const errors = [];
  if (model.milestoneVersion !== VISIBLE_SHELL_ATTACHMENT_MILESTONE_VERSION) errors.push('Unexpected V220 version.');
  if (model.visualMutationAllowed !== false) errors.push('V220 must not mutate visuals.');
  if (model.status !== 'READY_FOR_CONTROLLED_APP_INTEGRATION') errors.push('V220 status is not ready.');
  if (!model.qa || model.qa.ok !== true) errors.push('V220 QA is not OK.');
  return { ok: errors.length === 0, version: model.milestoneVersion, status: model.status, nextRecommendedStep: model.nextRecommendedStep, errors };
}
