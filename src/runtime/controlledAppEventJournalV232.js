// LOSKOT FVE & LPS STUDIO PRO
// V232 controlled-app-event-journal

import { createControlledAppCommandBus, validateControlledAppCommandBus } from './controlledAppCommandBusV231.js';

export const CONTROLLED_APP_EVENT_JOURNAL_VERSION = 'v232-controlled-app-event-journal';

export function createControlledAppEventJournal(options = {}) {
  const previous = createControlledAppCommandBus(options);
  const validation = validateControlledAppCommandBus(previous);
  return {
    modelVersion: CONTROLLED_APP_EVENT_JOURNAL_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V232_READY' : 'BLOCKED',
    visualMutationAllowed: false,
    controls: {
      readOnly: true,
      canWriteUi: false,
      canMutateVisuals: false,
      canPush: false,
      canMerge: false,
      canChangePackage: false
    },
    metrics: {
      runtimeStep: 232,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_EVENT_JOURNAL_VERSION
    }
  };
}

export function validateControlledAppEventJournal(model = createControlledAppEventJournal()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_EVENT_JOURNAL_VERSION) errors.push('Unexpected V232 version.');
  if (model.visualMutationAllowed !== false) errors.push('V232 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V232 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V232 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V232 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V232 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V232 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
