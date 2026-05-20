// LOSKOT FVE & LPS STUDIO PRO
// V201 App Shell Runtime Diagnostics

import { createAppShellRuntimeCommandPreview, validateAppShellRuntimeCommandPreview } from './appShellRuntimeCommandPreviewV200.js';

export const APP_SHELL_RUNTIME_DIAGNOSTICS_VERSION = 'v201-app-shell-runtime-diagnostics';

export function createAppShellRuntimeDiagnostics(options = {}) {
  const preview = createAppShellRuntimeCommandPreview(options);
  const validation = validateAppShellRuntimeCommandPreview(preview);
  const diagnostics = [
    { key: 'commands-ready', ok: validation.ok },
    { key: 'visual-lock', ok: preview.visualMutationAllowed === false },
    { key: 'read-only-events', ok: preview.queue.events.every((event) => event.readOnly === true) },
    { key: 'inspector-ready', ok: preview.queue.sync.inspector.ready === true }
  ];
  const failed = diagnostics.filter((item) => !item.ok);
  return {
    diagnosticsVersion: APP_SHELL_RUNTIME_DIAGNOSTICS_VERSION,
    ready: failed.length === 0,
    visualMutationAllowed: false,
    diagnostics,
    preview,
    qa: { ok: failed.length === 0, failedCount: failed.length, errors: failed.map((item) => item.key) }
  };
}

export function validateAppShellRuntimeDiagnostics(model = createAppShellRuntimeDiagnostics()) {
  const errors = [];
  if (model.diagnosticsVersion !== APP_SHELL_RUNTIME_DIAGNOSTICS_VERSION) errors.push('Unexpected V201 version.');
  if (model.visualMutationAllowed !== false) errors.push('V201 must not mutate visuals.');
  if (!Array.isArray(model.diagnostics) || model.diagnostics.length !== 4) errors.push('V201 diagnostics count must be 4.');
  if (!model.qa || model.qa.ok !== true) errors.push('V201 QA is not OK.');
  return { ok: errors.length === 0, version: model.diagnosticsVersion, failedCount: model.qa?.failedCount ?? null, errors };
}
