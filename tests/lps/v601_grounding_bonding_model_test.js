import assert from 'node:assert/strict';
import okProject from '../fixtures/v581_v630/lps_spd_grounding_project_ok.json' with { type: 'json' };
import errorProject from '../fixtures/v581_v630/lps_spd_grounding_project_with_errors.json' with { type: 'json' };
import { evaluateGroundingPracticalModel } from '../../src/lps/groundingPracticalModelV601.js';

const ok = evaluateGroundingPracticalModel(okProject);
assert.equal(ok.module, 'V601_GROUNDING_BONDING_PRACTICAL_MODEL');
assert.equal(ok.qaFindings.length, 0);
assert.equal(ok.grounding.resistanceOhm, 6.2);
assert.equal(ok.bonding.mainEquipotentialBusbarPresent, true);

const withErrors = evaluateGroundingPracticalModel(errorProject);
const codes = withErrors.qaFindings.map((finding) => finding.code);
assert.ok(codes.includes('QA-GND-001'));
assert.ok(codes.includes('QA-GND-002'));
assert.ok(codes.includes('QA-GND-003'));
assert.ok(codes.includes('QA-GND-004'));
assert.ok(codes.includes('QA-GND-005'));
assert.ok(codes.includes('QA-GND-006'));
assert.ok(codes.includes('QA-GND-007'));
assert.ok(codes.includes('QA-GND-008'));

console.log('v601_grounding_bonding_model_test: OK');
