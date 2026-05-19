// LOSKOT FVE & LPS STUDIO PRO
// V199 App Shell Runtime Event Queue

import { createAppShellRuntimeSynchronizationPlan, validateAppShellRuntimeSynchronizationPlan } from './appShellRuntimeSynchronizationPlanV198.js';

export const APP_SHELL_RUNTIME_EVENT_QUEUE_VERSION = 'v199-app-shell-runtime-event-queue';

export function createAppShellRuntimeEventQueue(options = {}) {
  const sync = createAppShellRuntimeSynchronizationPlan(options);
  const validation = validateAppShellRuntimeSynchronizationPlan(sync);
  const events = sync.syncSteps.filter((step) => step.allowed).map((step, index) => ({
    order: index + 1,
    type: step.key,
    readOnly: true
  }));
  return {
    queueVersion: APP_SHELL_RUNTIME_EVENT_QUEUE_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    events,
    sync,
    qa: { ok: validation.ok && events.length === 3, eventCount: events.length, errors: validation.errors }
  };
}

export function validateAppShellRuntimeEventQueue(model = createAppShellRuntimeEventQueue()) {
  const errors = [];
  if (model.queueVersion !== APP_SHELL_RUNTIME_EVENT_QUEUE_VERSION) errors.push('Unexpected V199 version.');
  if (model.visualMutationAllowed !== false) errors.push('V199 must not mutate visuals.');
  if (!Array.isArray(model.events) || model.events.length !== 3) errors.push('V199 event count must be 3.');
  if (!model.qa || model.qa.ok !== true) errors.push('V199 QA is not OK.');
  return { ok: errors.length === 0, version: model.queueVersion, eventCount: model.events?.length || 0, errors };
}
