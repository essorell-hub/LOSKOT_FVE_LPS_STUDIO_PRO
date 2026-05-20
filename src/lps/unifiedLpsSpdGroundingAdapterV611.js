import { evaluateLpsPracticalModel } from './lpsPracticalModelV581.js';
import { evaluateSpdPracticalModel } from './spdPracticalModelV591.js';
import { evaluateGroundingPracticalModel } from './groundingPracticalModelV601.js';

export function evaluateUnifiedLpsSpdGroundingModel(input = {}) {
  const lps = evaluateLpsPracticalModel(input);
  const spd = evaluateSpdPracticalModel(input);
  const groundingBonding = evaluateGroundingPracticalModel(input);

  return {
    module: 'V611_UNIFIED_LPS_SPD_GROUNDING_ADAPTER',
    version: 'V611',
    lps,
    spd,
    groundingBonding,
    qaFindings: [
      ...prefixFindings('lps', lps.qaFindings),
      ...prefixFindings('spd', spd.qaFindings),
      ...prefixFindings('groundingBonding', groundingBonding.qaFindings),
    ],
  };
}

function prefixFindings(scope, findings = []) {
  return findings.map((finding) => ({
    ...finding,
    scope,
  }));
}
