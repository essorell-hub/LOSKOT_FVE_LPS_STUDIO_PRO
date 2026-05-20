'use strict';

import assert from 'node:assert';
import {
  evaluateSpdCoordination,
  evaluateLpZones,
  evaluateSpdQa,
} from '../../src/lps/spdCoordinationModel.js';
import {
  createQaFinding,
  runQaFeed,
  summarizeQaFindings,
} from '../../src/validation/qaFeedEngine.js';

function hasCode(findings, code) {
  return findings.some((finding) => finding.code === code);
}

const validInput = {
  spdDevices: [
    { id: 'spd-main', type: 'T1', location: 'building-entry', side: 'AC', Up: 1.5, Uc: 275, grounded: true },
    { id: 'spd-dc', type: 'T2', location: 'pv-dc', side: 'DC', Up: 2.5, Uc: 1000, bonded: true },
  ],
  lpZones: [
    { id: 'LPZ0' },
    { id: 'LPZ1', from: 'LPZ0' },
    { id: 'LPZ2', from: 'LPZ1' },
  ],
  routes: [
    { id: 'dc-1', lengthM: 8, hasSupplementarySpd: false },
    { id: 'dc-2', lengthM: 18, hasSupplementarySpd: true },
  ],
  grounding: { connected: true },
  bonding: { connected: true },
};

const valid = evaluateSpdCoordination(validInput);
assert.deepStrictEqual(valid.qaFindings, []);
assert.strictEqual(valid.spdDevices.length, 2);
assert.strictEqual(valid.lpZones.length, 3);

const missingT1 = evaluateSpdQa(Object.assign({}, validInput, {
  spdDevices: validInput.spdDevices.filter((device) => device.type !== 'T1'),
}));
assert.ok(hasCode(missingT1, 'QA-SPD-001'));

const missingDc = evaluateSpdQa(Object.assign({}, validInput, {
  spdDevices: validInput.spdDevices.filter((device) => device.side !== 'DC'),
}));
assert.ok(hasCode(missingDc, 'QA-SPD-002'));

const longRoute = evaluateSpdQa(Object.assign({}, validInput, {
  routes: [{ id: 'long', lengthM: 22, hasSupplementarySpd: false }],
}));
assert.ok(hasCode(longRoute, 'QA-SPD-003'));

const lpzBreak = evaluateLpZones([
  { id: 'LPZ0' },
  { id: 'LPZ2', from: 'LPZ9' },
]);
assert.ok(hasCode(lpzBreak.qaFindings, 'QA-SPD-004'));

const missingGround = evaluateSpdQa(Object.assign({}, validInput, {
  grounding: { connected: false },
  bonding: { connected: false },
  spdDevices: validInput.spdDevices.map((device) => Object.assign({}, device, { grounded: false, bonded: false })),
}));
assert.ok(hasCode(missingGround, 'QA-SPD-005'));

const missingUp = evaluateSpdQa(Object.assign({}, validInput, {
  spdDevices: [{ id: 'bad-up', type: 'T1', location: 'building-entry', side: 'AC', Uc: 275, grounded: true }],
}));
assert.ok(hasCode(missingUp, 'QA-SPD-006'));

const invalidType = evaluateSpdQa(Object.assign({}, validInput, {
  spdDevices: [{ id: 'bad-type', type: 'TX', location: 'building-entry', side: 'AC', Up: 1.5, Uc: 275, grounded: true }],
}));
assert.ok(hasCode(invalidType, 'QA-SPD-007'));

const combined = evaluateSpdCoordination({
  spdDevices: [{ id: 'bad', type: 'TX' }],
  lpZones: [{}, { id: 'LPZ2', from: 'LPZ9' }],
  routes: [{ lengthM: 30 }],
});
assert.ok(combined.qaFindings.length >= 6);
assert.ok(hasCode(combined.qaFindings, 'QA-SPD-001'));
assert.ok(hasCode(combined.qaFindings, 'QA-SPD-007'));

const finding = createQaFinding('X-001', 'ERROR', 'Synthetic finding.', { source: 'TEST' });
assert.strictEqual(finding.severity, 'ERROR');
assert.strictEqual(finding.source, 'TEST');

const summary = summarizeQaFindings([
  createQaFinding('I', 'INFO', 'i'),
  createQaFinding('W', 'WARN', 'w'),
  createQaFinding('E', 'ERROR', 'e'),
  createQaFinding('B', 'BLOCKER', 'b'),
]);
assert.strictEqual(summary.total, 4);
assert.strictEqual(summary.releaseGo, false);
assert.strictEqual(summary.bySeverity.ERROR, 1);
assert.strictEqual(summary.bySeverity.BLOCKER, 1);

const feedGo = runQaFeed({ spdFindings: valid.qaFindings, project: { projectId: 'P1', projectName: 'Local baseline' } });
assert.strictEqual(feedGo.releaseGo, true);
assert.strictEqual(feedGo.qaSummary.total, 0);

const feedBlocked = runQaFeed({
  spdFindings: [createQaFinding('QA-SPD-001', 'ERROR', 'Missing T1.')],
  project: { projectId: 'P2', projectName: 'Local baseline' },
});
assert.strictEqual(feedBlocked.releaseGo, false);

const guardBlocked = runQaFeed({
  project: { projectId: 'P3', notes: 'FQ1' },
});
assert.strictEqual(guardBlocked.releaseGo, false);
assert.ok(hasCode(guardBlocked.qaFindings, 'BLK-005'));

const daWordGuard = runQaFeed({
  project: { projectId: 'P4', notes: 'DA' },
});
assert.ok(hasCode(daWordGuard.qaFindings, 'BLK-005'));

const normalWordDoesNotTriggerShortGuard = runQaFeed({
  project: { projectId: 'P5', notes: 'standard local project' },
});
assert.strictEqual(normalWordDoesNotTriggerShortGuard.releaseGo, true);

console.log('V461_SPD_COORDINATION_TEST=PASS');
