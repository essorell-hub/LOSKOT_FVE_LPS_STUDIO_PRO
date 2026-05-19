import assert from 'node:assert/strict';
import { createVisibleShellReadOnlyAttachment, validateVisibleShellReadOnlyAttachment } from '../../src/runtime/visibleShellReadOnlyAttachmentV172.js';
import { createVisibleShellNavigationFeed, validateVisibleShellNavigationFeed } from '../../src/runtime/visibleShellNavigationFeedV173.js';
import { createVisibleShellWorkspaceFeed, validateVisibleShellWorkspaceFeed } from '../../src/runtime/visibleShellWorkspaceFeedV174.js';
import { createVisibleShellQaFeed, validateVisibleShellQaFeed } from '../../src/runtime/visibleShellQaFeedV175.js';
import { createVisibleShellProjectHeaderFeed, validateVisibleShellProjectHeaderFeed } from '../../src/runtime/visibleShellProjectHeaderFeedV176.js';
import { createVisibleShellStatusFooterFeed, validateVisibleShellStatusFooterFeed } from '../../src/runtime/visibleShellStatusFooterFeedV177.js';
import { createVisibleShellReadOnlyContract, validateVisibleShellReadOnlyContract } from '../../src/runtime/visibleShellReadOnlyContractV178.js';
import { createVisibleShellPreflightGate, validateVisibleShellPreflightGate } from '../../src/runtime/visibleShellPreflightGateV179.js';
import { createVisibleShellIntegrationPlan, validateVisibleShellIntegrationPlan } from '../../src/runtime/visibleShellIntegrationPlanV180.js';

console.log('Starting V172-V180 LONG AUTO runner smoke test...');

const projectContext = { projectId: 'V172-V180-PROJECT', projectName: 'Visible shell readiness', revision: 'test' };

const attachment = createVisibleShellReadOnlyAttachment({ activeRouteKey: 'dashboard', projectContext });
assert.equal(validateVisibleShellReadOnlyAttachment(attachment).ok, true);
assert.equal(attachment.writeToUiAllowed, false);

const nav = createVisibleShellNavigationFeed({ activeRouteKey: 'documents', projectContext });
assert.equal(validateVisibleShellNavigationFeed(nav).ok, true);
assert.equal(nav.navigationItems.length, 13);

const workspace = createVisibleShellWorkspaceFeed({ activeRouteKey: 'reports-statements', projectContext });
assert.equal(validateVisibleShellWorkspaceFeed(workspace).ok, true);
assert.equal(workspace.workspace.canModifyLayout, false);

const qa = createVisibleShellQaFeed({ activeRouteKey: 'exports', projectContext });
assert.equal(validateVisibleShellQaFeed(qa).ok, true);
assert.equal(qa.qa.failedCount, 0);

const header = createVisibleShellProjectHeaderFeed({ activeRouteKey: 'database', projectContext });
assert.equal(validateVisibleShellProjectHeaderFeed(header).ok, true);
assert.equal(header.header.readOnly, true);

const footer = createVisibleShellStatusFooterFeed({ activeRouteKey: 'settings', projectContext });
assert.equal(validateVisibleShellStatusFooterFeed(footer).ok, true);
assert.equal(footer.footer.readOnly, true);

const contract = createVisibleShellReadOnlyContract({ activeRouteKey: 'fve-2d-layout', projectContext });
assert.equal(validateVisibleShellReadOnlyContract(contract).ok, true);
assert.equal(contract.contract.mayModifyCss, false);

const gate = createVisibleShellPreflightGate({ activeRouteKey: 'lps-lightning-protection', projectContext });
assert.equal(validateVisibleShellPreflightGate(gate).ok, true);
assert.equal(gate.qa.blockedCount, 0);

const plan = createVisibleShellIntegrationPlan({ activeRouteKey: 'dashboard', projectContext });
const planValidation = validateVisibleShellIntegrationPlan(plan);
assert.equal(planValidation.ok, true);
assert.equal(planValidation.readyForNextStep, true);
assert.equal(plan.plan.length, 6);

console.log('V172-V180 LONG AUTO runner smoke test passed:', JSON.stringify({
  attachment: validateVisibleShellReadOnlyAttachment(attachment),
  navigation: validateVisibleShellNavigationFeed(nav),
  workspace: validateVisibleShellWorkspaceFeed(workspace),
  qa: validateVisibleShellQaFeed(qa),
  header: validateVisibleShellProjectHeaderFeed(header),
  footer: validateVisibleShellStatusFooterFeed(footer),
  contract: validateVisibleShellReadOnlyContract(contract),
  gate: validateVisibleShellPreflightGate(gate),
  plan: planValidation
}, null, 2));
