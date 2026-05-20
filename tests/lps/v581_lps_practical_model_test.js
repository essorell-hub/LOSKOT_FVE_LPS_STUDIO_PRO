import assert from 'node:assert/strict';
import okProject from '../fixtures/v581_v630/lps_spd_grounding_project_ok.json' with { type: 'json' };
import errorProject from '../fixtures/v581_v630/lps_spd_grounding_project_with_errors.json' with { type: 'json' };
import { evaluateLpsPracticalModel } from '../../src/lps/lpsPracticalModelV581.js';

const ok = evaluateLpsPracticalModel(okProject);
assert.equal(ok.module, 'V581_LPS_PRACTICAL_MODEL');
assert.equal(ok.riskPlaceholder.isPlaceholder, true);
assert.equal(ok.riskPlaceholder.normative, false);
assert.equal(ok.separationDistance.isPlaceholder, true);
assert.equal(ok.separationDistance.normative, false);
assert.equal(ok.qaFindings.length, 0);

const withErrors = evaluateLpsPracticalModel(errorProject);
const codes = withErrors.qaFindings.map((finding) => finding.code);
assert.ok(codes.includes('QA-LPS-001'));
assert.ok(codes.includes('QA-LPS-002'));
assert.ok(codes.includes('QA-LPS-003'));
assert.ok(codes.includes('QA-LPS-004'));
assert.ok(codes.includes('QA-LPS-005'));
assert.ok(codes.includes('QA-LPS-006'));
assert.ok(codes.includes('QA-LPS-007'));
assert.ok(codes.includes('QA-LPS-008'));
assert.ok(codes.includes('QA-LPS-010'));
assert.equal(withErrors.separationDistance.normative, false);

console.log('v581_lps_practical_model_test: OK');
