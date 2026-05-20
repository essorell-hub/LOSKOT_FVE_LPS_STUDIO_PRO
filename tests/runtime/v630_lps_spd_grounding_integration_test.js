import assert from 'node:assert/strict';
import okProject from '../fixtures/v581_v630/lps_spd_grounding_project_ok.json' with { type: 'json' };
import errorProject from '../fixtures/v581_v630/lps_spd_grounding_project_with_errors.json' with { type: 'json' };
import { evaluateUnifiedLpsSpdGroundingModel } from '../../src/lps/unifiedLpsSpdGroundingAdapterV611.js';

const ok = evaluateUnifiedLpsSpdGroundingModel(okProject);
assert.equal(ok.module, 'V611_UNIFIED_LPS_SPD_GROUNDING_ADAPTER');
assert.equal(ok.qaFindings.length, 0);
assert.equal(ok.lps.separationDistance.isPlaceholder, true);
assert.equal(ok.lps.separationDistance.normative, false);

const withErrors = evaluateUnifiedLpsSpdGroundingModel(errorProject);
const codes = withErrors.qaFindings.map((finding) => finding.code);
assert.ok(codes.includes('QA-LPS-001'));
assert.ok(codes.includes('QA-SPD-PRACT-001'));
assert.ok(codes.includes('QA-GND-001'));
assert.ok(withErrors.qaFindings.every((finding) => finding.scope));
assert.equal(withErrors.lps.riskPlaceholder.normative, false);

console.log('v630_lps_spd_grounding_integration_test: OK');
