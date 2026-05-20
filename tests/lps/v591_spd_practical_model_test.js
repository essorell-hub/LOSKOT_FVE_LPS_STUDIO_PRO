import assert from 'node:assert/strict';
import okProject from '../fixtures/v581_v630/lps_spd_grounding_project_ok.json' with { type: 'json' };
import errorProject from '../fixtures/v581_v630/lps_spd_grounding_project_with_errors.json' with { type: 'json' };
import { evaluateSpdPracticalModel } from '../../src/lps/spdPracticalModelV591.js';

const ok = evaluateSpdPracticalModel(okProject);
assert.equal(ok.module, 'V591_SPD_PRACTICAL_MODEL');
assert.equal(ok.qaFindings.length, 0);
assert.equal(ok.devices.t1.present, true);
assert.equal(ok.devices.ac.present, true);
assert.equal(ok.devices.dc.present, true);

const withErrors = evaluateSpdPracticalModel(errorProject);
const codes = withErrors.qaFindings.map((finding) => finding.code);
assert.ok(codes.includes('QA-SPD-PRACT-001'));
assert.ok(codes.includes('QA-SPD-PRACT-002'));
assert.ok(codes.includes('QA-SPD-PRACT-003'));
assert.ok(codes.includes('QA-SPD-PRACT-004'));
assert.ok(codes.includes('QA-SPD-PRACT-007'));

console.log('v591_spd_practical_model_test: OK');
