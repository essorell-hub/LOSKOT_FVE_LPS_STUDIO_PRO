// LOSKOT FVE & LPS STUDIO PRO
// V181 App Shell Read-Only Data Binder

import { createVisibleShellIntegrationPlan, validateVisibleShellIntegrationPlan } from './visibleShellIntegrationPlanV180.js';

export const APP_SHELL_READ_ONLY_DATA_BINDER_VERSION = 'v181-app-shell-read-only-data-binder';

export function createAppShellReadOnlyDataBinder(options = {}) {
  const integrationPlan = createVisibleShellIntegrationPlan(options);
  const validation = validateVisibleShellIntegrationPlan(integrationPlan);
  const bindingPacket = {
    navigation: integrationPlan.gate.contractModel.footerFeed.headerFeed.qaFeed.workspace.navigation.navigationItems,
    workspace: integrationPlan.gate.contractModel.footerFeed.headerFeed.qaFeed.workspace.workspace,
    qa: integrationPlan.gate.contractModel.footerFeed.headerFeed.qaFeed.qa,
    projectHeader: integrationPlan.gate.contractModel.footerFeed.headerFeed.header,
    statusFooter: integrationPlan.gate.contractModel.footerFeed.footer
  };
  return {
    binderVersion: APP_SHELL_READ_ONLY_DATA_BINDER_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    writeToUiAllowed: false,
    bindingPacket,
    integrationPlan,
    qa: { ok: validation.ok, packetKeys: Object.keys(bindingPacket), errors: validation.errors }
  };
}

export function validateAppShellReadOnlyDataBinder(model = createAppShellReadOnlyDataBinder()) {
  const errors = [];
  if (model.binderVersion !== APP_SHELL_READ_ONLY_DATA_BINDER_VERSION) errors.push('Unexpected V181 version.');
  if (model.visualMutationAllowed !== false || model.writeToUiAllowed !== false) errors.push('V181 must be read-only.');
  if (!model.bindingPacket || Object.keys(model.bindingPacket).length !== 5) errors.push('V181 packet must contain 5 regions.');
  if (!model.qa || model.qa.ok !== true) errors.push('V181 QA is not OK.');
  return { ok: errors.length === 0, version: model.binderVersion, packetKeys: model.qa?.packetKeys || [], errors };
}
