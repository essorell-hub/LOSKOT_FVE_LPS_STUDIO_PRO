// LOSKOT FVE & LPS STUDIO PRO
// V178 Visible Shell Read-Only Contract

import {
  VISIBLE_SHELL_STATUS_FOOTER_FEED_VERSION,
  createVisibleShellStatusFooterFeed,
  validateVisibleShellStatusFooterFeed
} from './visibleShellStatusFooterFeedV177.js';

export const VISIBLE_SHELL_READ_ONLY_CONTRACT_VERSION = 'v178-visible-shell-read-only-contract';

export function createVisibleShellReadOnlyContract(options = {}) {
  const footerFeed = createVisibleShellStatusFooterFeed(options);
  const validation = validateVisibleShellStatusFooterFeed(footerFeed);
  const contract = {
    mayBindData: true,
    mayReadRuntime: true,
    mayModifyCss: false,
    mayModifyHtml: false,
    mayModifyComponents: false,
    mayModifyApprovedGraphics: false,
    mayCommitUiChange: false
  };
  return {
    contractVersion: VISIBLE_SHELL_READ_ONLY_CONTRACT_VERSION,
    footerFeedVersion: VISIBLE_SHELL_STATUS_FOOTER_FEED_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    contract,
    footerFeed,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellReadOnlyContract(model = createVisibleShellReadOnlyContract()) {
  const errors = [];
  if (model.contractVersion !== VISIBLE_SHELL_READ_ONLY_CONTRACT_VERSION) errors.push('Unexpected V178 version.');
  if (model.visualMutationAllowed !== false) errors.push('V178 must not allow visual mutation.');
  if (!model.contract || model.contract.mayModifyCss !== false || model.contract.mayModifyComponents !== false) errors.push('V178 contract unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V178 QA is not OK.');
  return { ok: errors.length === 0, version: model.contractVersion, errors };
}
