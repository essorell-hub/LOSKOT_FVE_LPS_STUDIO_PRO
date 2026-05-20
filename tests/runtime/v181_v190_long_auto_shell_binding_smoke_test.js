import assert from 'node:assert/strict';
import { createAppShellReadOnlyDataBinder, validateAppShellReadOnlyDataBinder } from '../../src/runtime/appShellReadOnlyDataBinderV181.js';
import { createAppShellNavigationBinding, validateAppShellNavigationBinding } from '../../src/runtime/appShellNavigationBindingV182.js';
import { createAppShellWorkspaceBinding, validateAppShellWorkspaceBinding } from '../../src/runtime/appShellWorkspaceBindingV183.js';
import { createAppShellQaPanelBinding, validateAppShellQaPanelBinding } from '../../src/runtime/appShellQaPanelBindingV184.js';
import { createAppShellProjectHeaderBinding, validateAppShellProjectHeaderBinding } from '../../src/runtime/appShellProjectHeaderBindingV185.js';
import { createAppShellStatusFooterBinding, validateAppShellStatusFooterBinding } from '../../src/runtime/appShellStatusFooterBindingV186.js';
import { createAppShellBindingSnapshot, validateAppShellBindingSnapshot } from '../../src/runtime/appShellBindingSnapshotV187.js';
import { createAppShellBindingValidator, validateAppShellBindingValidator } from '../../src/runtime/appShellBindingValidatorV188.js';
import { createAppShellNoVisualMutationGate, validateAppShellNoVisualMutationGate } from '../../src/runtime/appShellNoVisualMutationGateV189.js';
import { createAppShellRuntimeAttachmentPlan, validateAppShellRuntimeAttachmentPlan } from '../../src/runtime/appShellRuntimeAttachmentPlanV190.js';

console.log('Starting V181-V190 LONG AUTO shell binding smoke test...');

const projectContext = { projectId: 'V181-V190-PROJECT', projectName: 'App shell binding', revision: 'test' };

const binder = createAppShellReadOnlyDataBinder({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellReadOnlyDataBinder(binder).ok, true);
assert.equal(binder.writeToUiAllowed, false);

const navigation = createAppShellNavigationBinding({ activeRouteKey: 'documents', projectContext });
assert.equal(validateAppShellNavigationBinding(navigation).ok, true);
assert.equal(navigation.navigationBinding.itemCount, 13);

const workspace = createAppShellWorkspaceBinding({ activeRouteKey: 'fve-2d-layout', projectContext });
assert.equal(validateAppShellWorkspaceBinding(workspace).ok, true);
assert.equal(workspace.workspaceBinding.canModifyLayout, false);

const qaPanel = createAppShellQaPanelBinding({ activeRouteKey: 'reports-statements', projectContext });
assert.equal(validateAppShellQaPanelBinding(qaPanel).ok, true);
assert.equal(qaPanel.qaPanelBinding.readOnly, true);

const header = createAppShellProjectHeaderBinding({ activeRouteKey: 'database', projectContext });
assert.equal(validateAppShellProjectHeaderBinding(header).ok, true);
assert.equal(header.projectHeaderBinding.readOnly, true);

const footer = createAppShellStatusFooterBinding({ activeRouteKey: 'exports', projectContext });
assert.equal(validateAppShellStatusFooterBinding(footer).ok, true);
assert.equal(footer.statusFooterBinding.readOnly, true);

const snapshot = createAppShellBindingSnapshot({ activeRouteKey: 'settings', projectContext });
assert.equal(validateAppShellBindingSnapshot(snapshot).ok, true);
assert.equal(snapshot.qa.regionCount, 5);

const validator = createAppShellBindingValidator({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellBindingValidator(validator).ok, true);
assert.equal(validator.qa.failedCount, 0);

const gate = createAppShellNoVisualMutationGate({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateAppShellNoVisualMutationGate(gate).ok, true);
assert.equal(gate.qa.blockedCount, 0);

const plan = createAppShellRuntimeAttachmentPlan({ activeRouteKey: 'dashboard', projectContext });
const planValidation = validateAppShellRuntimeAttachmentPlan(plan);
assert.equal(planValidation.ok, true);
assert.equal(planValidation.readyForImplementation, true);
assert.equal(plan.steps.length, 6);

console.log('V181-V190 LONG AUTO shell binding smoke test passed:', JSON.stringify({
  binder: validateAppShellReadOnlyDataBinder(binder),
  navigation: validateAppShellNavigationBinding(navigation),
  workspace: validateAppShellWorkspaceBinding(workspace),
  qaPanel: validateAppShellQaPanelBinding(qaPanel),
  header: validateAppShellProjectHeaderBinding(header),
  footer: validateAppShellStatusFooterBinding(footer),
  snapshot: validateAppShellBindingSnapshot(snapshot),
  validator: validateAppShellBindingValidator(validator),
  gate: validateAppShellNoVisualMutationGate(gate),
  plan: planValidation
}, null, 2));
