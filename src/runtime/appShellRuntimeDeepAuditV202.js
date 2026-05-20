// LOSKOT FVE & LPS STUDIO PRO
// V202 App Shell Runtime Deep Audit

import { createAppShellRuntimeDiagnostics, validateAppShellRuntimeDiagnostics } from './appShellRuntimeDiagnosticsV201.js';

export const APP_SHELL_RUNTIME_DEEP_AUDIT_VERSION = 'v202-app-shell-runtime-deep-audit';

export function createAppShellRuntimeDeepAudit(options = {}) {
  const diagnostics = createAppShellRuntimeDiagnostics(options);
  const validation = validateAppShellRuntimeDiagnostics(diagnostics);
  const audit = {
    runtimeReady: validation.ok,
    routeCount: diagnostics.preview.queue.sync.inspector.rightQa.workspace.leftMenu.modules.routes.routeMap.length,
    moduleCount: diagnostics.preview.queue.sync.inspector.rightQa.workspace.leftMenu.modules.moduleMap.length,
    mountPointCount: diagnostics.preview.queue.sync.inspector.rightQa.workspace.leftMenu.modules.routes.mount.mountPoints.length,
    commandCount: diagnostics.preview.commands.length,
    visualMutationAllowed: false
  };
  return {
    auditVersion: APP_SHELL_RUNTIME_DEEP_AUDIT_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    audit,
    diagnostics,
    qa: { ok: validation.ok && audit.routeCount === 13 && audit.moduleCount === 13 && audit.mountPointCount === 5, errors: validation.errors }
  };
}

export function validateAppShellRuntimeDeepAudit(model = createAppShellRuntimeDeepAudit()) {
  const errors = [];
  if (model.auditVersion !== APP_SHELL_RUNTIME_DEEP_AUDIT_VERSION) errors.push('Unexpected V202 version.');
  if (model.visualMutationAllowed !== false) errors.push('V202 must not mutate visuals.');
  if (!model.audit || model.audit.routeCount !== 13 || model.audit.moduleCount !== 13) errors.push('V202 counts invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V202 QA is not OK.');
  return { ok: errors.length === 0, version: model.auditVersion, routeCount: model.audit?.routeCount || 0, moduleCount: model.audit?.moduleCount || 0, errors };
}
