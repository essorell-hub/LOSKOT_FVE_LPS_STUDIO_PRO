'use strict';

import assert from 'node:assert';
import {
  calculateStringElectricals,
  evaluateStringQa,
  calculateFveStringSet,
} from '../../src/fve/stringCalculatorV422.js';

const baseInput = {
  moduleCount: 10,
  Voc_STC: 40,
  Vmp_STC: 34,
  Isc_STC: 11,
  Imp_STC: 10.4,
  tempCoeffVocPctPerC: -0.28,
  tempCoeffVmpPctPerC: -0.35,
  minTempC: -10,
  maxTempC: 70,
  inverterLimits: {
    maxDcVoltage: 600,
    mpptMinVoltage: 250,
    mpptMaxVoltage: 500,
    maxMpptInputCurrent: 13,
  },
};

function hasCode(findings, code) {
  return findings.some((finding) => finding.code === code);
}

const electricals = calculateStringElectricals(baseInput);
assert.strictEqual(Math.round(electricals.vocCold * 10) / 10, 439.2);
assert.strictEqual(Math.round(electricals.vmpHot * 100) / 100, 286.45);
assert.strictEqual(electricals.isc, 11);
assert.strictEqual(electricals.imp, 10.4);
assert.strictEqual(electricals.moduleCount, 10);

const cleanResult = calculateFveStringSet(baseInput);
assert.deepStrictEqual(cleanResult.qaFindings, []);
assert.strictEqual(cleanResult.moduleCount, 10);

const overVoltage = calculateFveStringSet(Object.assign({}, baseInput, {
  moduleCount: 15,
  inverterLimits: Object.assign({}, baseInput.inverterLimits, { maxDcVoltage: 600 }),
}));
assert.ok(hasCode(overVoltage.qaFindings, 'QA-FVE-002'));

const lowMppt = calculateFveStringSet(Object.assign({}, baseInput, { moduleCount: 6 }));
assert.ok(hasCode(lowMppt.qaFindings, 'QA-FVE-003'));

const highMppt = calculateFveStringSet(Object.assign({}, baseInput, { moduleCount: 18 }));
assert.ok(hasCode(highMppt.qaFindings, 'QA-FVE-003'));

const invalidCount = calculateFveStringSet(Object.assign({}, baseInput, { moduleCount: 0 }));
assert.ok(hasCode(invalidCount.qaFindings, 'QA-FVE-004'));

const overCurrent = calculateFveStringSet(Object.assign({}, baseInput, {
  Isc_STC: 14,
  inverterLimits: Object.assign({}, baseInput.inverterLimits, { maxMpptInputCurrent: 13 }),
}));
assert.ok(hasCode(overCurrent.qaFindings, 'QA-FVE-005'));

const directQa = evaluateStringQa({ vocCold: 700, vmpHot: 300, isc: 10, imp: 10, moduleCount: 12 }, baseInput.inverterLimits);
assert.ok(hasCode(directQa, 'QA-FVE-002'));

const missingLimits = evaluateStringQa(electricals, {});
assert.deepStrictEqual(missingLimits, []);

const nonNumeric = calculateFveStringSet({ moduleCount: 'bad', inverterLimits: {} });
assert.strictEqual(nonNumeric.moduleCount, 0);
assert.ok(hasCode(nonNumeric.qaFindings, 'QA-FVE-004'));

const stringNumbers = calculateFveStringSet(Object.assign({}, baseInput, { moduleCount: '10' }));
assert.strictEqual(stringNumbers.moduleCount, 10);
assert.deepStrictEqual(stringNumbers.qaFindings, []);

console.log('V422_STRING_CALCULATOR_TEST=PASS');
