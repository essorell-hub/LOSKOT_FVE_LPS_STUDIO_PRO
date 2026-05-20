import assert from 'node:assert/strict';
import {
  APPROVED_UI_BASELINE,
  APPROVED_MAIN_SCREENS,
  PRIMARY_WORKFLOW_ORDER,
  getApprovedUiBaseline,
  getApprovedMainScreens,
  getApprovedScreenByRoute,
  validateUiFoundationRegistry
} from '../../src/runtime/uiFoundationRegistryV151.js';

console.log('Starting V151 UI Foundation Registry smoke test...');

assert.equal(APPROVED_UI_BASELINE.id, 'APPROVED_UI_STYLE_BASELINE_01');
assert.equal(getApprovedUiBaseline().status, 'LOCKED_APPROVED');

const screens = getApprovedMainScreens();
assert.equal(screens.length, APPROVED_MAIN_SCREENS.length);
assert.equal(screens.length, 15);

assert.deepEqual(
  screens.map((screen) => screen.routeKey),
  PRIMARY_WORKFLOW_ORDER
);

for (const screen of screens) {
  assert.equal(screen.locked, true, 'Screen must be locked: ' + screen.id);
  assert.equal(typeof screen.labelCs, 'string');
  assert.ok(screen.labelCs.length > 2);
  assert.equal(typeof screen.routeKey, 'string');
  assert.ok(screen.routeKey.length > 2);
}

assert.equal(getApprovedScreenByRoute('dashboard').id, 'APPROVED_SCREEN_DASHBOARD_01_VARIANT_A');
assert.equal(getApprovedScreenByRoute('exports').id, 'APPROVED_SCREEN_EXPORTS_01_VARIANT_A');
assert.equal(getApprovedScreenByRoute('missing-route'), null);

const validation = validateUiFoundationRegistry();
assert.equal(validation.ok, true);
assert.equal(validation.screenCount, 15);
assert.equal(validation.errors.length, 0);

console.log('V151 UI Foundation Registry smoke test passed:', JSON.stringify(validation, null, 2));
