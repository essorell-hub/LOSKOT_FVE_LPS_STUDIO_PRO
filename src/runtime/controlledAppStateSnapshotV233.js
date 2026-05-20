// LOSKOT FVE & LPS STUDIO PRO
// V233 controlled-app-state-snapshot

import { createControlledAppEventJournal, validateControlledAppEventJournal } from './controlledAppEventJournalV232.js';

export const CONTROLLED_APP_STATE_SNAPSHOT_VERSION = 'v233-controlled-app-state-snapshot';

export function createControlledAppStateSnapshot(options = {}) {
  const previous = createControlledAppEventJournal(options);
  const validation = validateControlledAppEventJournal(previous);
  return {
    modelVersion: CONTROLLED_APP_STATE_SNAPSHOT_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V233_READY' : 'BLOCKED',
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
      runtimeStep: 233,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_STATE_SNAPSHOT_VERSION
    }
  };
}

export function validateControlledAppStateSnapshot(model = createControlledAppStateSnapshot()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_STATE_SNAPSHOT_VERSION) errors.push('Unexpected V233 version.');
  if (model.visualMutationAllowed !== false) errors.push('V233 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V233 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V233 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V233 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V233 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V233 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
