// LOSKOT FVE & LPS STUDIO PRO
// V200 App Shell Runtime Command Preview

import { createAppShellRuntimeEventQueue, validateAppShellRuntimeEventQueue } from './appShellRuntimeEventQueueV199.js';

export const APP_SHELL_RUNTIME_COMMAND_PREVIEW_VERSION = 'v200-app-shell-runtime-command-preview';

export function createAppShellRuntimeCommandPreview(options = {}) {
  const queue = createAppShellRuntimeEventQueue(options);
  const validation = validateAppShellRuntimeEventQueue(queue);
  const commands = queue.events.map((event) => ({
    command: event.type,
    executable: true,
    mutatesVisuals: false,
    readOnly: true
  }));
  return {
    previewVersion: APP_SHELL_RUNTIME_COMMAND_PREVIEW_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    commands,
    queue,
    qa: { ok: validation.ok && commands.every((cmd) => cmd.mutatesVisuals === false), commandCount: commands.length, errors: validation.errors }
  };
}

export function validateAppShellRuntimeCommandPreview(model = createAppShellRuntimeCommandPreview()) {
  const errors = [];
  if (model.previewVersion !== APP_SHELL_RUNTIME_COMMAND_PREVIEW_VERSION) errors.push('Unexpected V200 version.');
  if (model.visualMutationAllowed !== false) errors.push('V200 must not mutate visuals.');
  if (!Array.isArray(model.commands) || model.commands.length !== 3) errors.push('V200 command count must be 3.');
  if (model.commands?.some((command) => command.mutatesVisuals !== false)) errors.push('V200 command mutates visuals.');
  if (!model.qa || model.qa.ok !== true) errors.push('V200 QA is not OK.');
  return { ok: errors.length === 0, version: model.previewVersion, commandCount: model.commands?.length || 0, errors };
}
