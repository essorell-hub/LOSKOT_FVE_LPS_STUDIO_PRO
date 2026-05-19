// LOSKOT FVE & LPS STUDIO PRO
// V172 Visible Shell Read-Only Attachment

import {
  FULL_RUNTIME_AUDIT_SNAPSHOT_VERSION,
  createFullRuntimeAuditSnapshot,
  validateFullRuntimeAuditSnapshot
} from './fullRuntimeAuditSnapshotV170.js';

export const VISIBLE_SHELL_READ_ONLY_ATTACHMENT_VERSION = 'v172-visible-shell-read-only-attachment';

export function createVisibleShellReadOnlyAttachment(options = {}) {
  const audit = createFullRuntimeAuditSnapshot({
    activeRouteKey: options.activeRouteKey,
    projectContext: options.projectContext
  });
  const validation = validateFullRuntimeAuditSnapshot(audit);
  return {
    attachmentVersion: VISIBLE_SHELL_READ_ONLY_ATTACHMENT_VERSION,
    auditVersion: FULL_RUNTIME_AUDIT_SNAPSHOT_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    writeToUiAllowed: false,
    readOnlyAttachmentAllowed: true,
    activeRouteKey: audit.snapshot.activeRouteKey,
    audit,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellReadOnlyAttachment(model = createVisibleShellReadOnlyAttachment()) {
  const errors = [];
  if (model.attachmentVersion !== VISIBLE_SHELL_READ_ONLY_ATTACHMENT_VERSION) errors.push('Unexpected V172 version.');
  if (model.auditVersion !== FULL_RUNTIME_AUDIT_SNAPSHOT_VERSION) errors.push('Unexpected V170 version.');
  if (model.visualMutationAllowed !== false) errors.push('V172 must not allow visual mutation.');
  if (model.writeToUiAllowed !== false) errors.push('V172 must be read-only.');
  if (!model.qa || model.qa.ok !== true) errors.push('V172 QA is not OK.');
  return { ok: errors.length === 0, version: model.attachmentVersion, activeRouteKey: model.activeRouteKey, errors };
}
