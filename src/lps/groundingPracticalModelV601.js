import { evaluateBondingPracticalModel } from './bondingPracticalModelV602.js';
import { evaluateGroundingBondingQa } from './groundingBondingQaModelV603.js';

export function evaluateGroundingPracticalModel(input = {}) {
  const grounding = input.grounding || {};
  const model = {
    module: 'V601_GROUNDING_BONDING_PRACTICAL_MODEL',
    version: 'V601',
    grounding: {
      electrodeType: grounding.electrodeType || null,
      resistanceOhm: Number.isFinite(grounding.resistanceOhm) ? grounding.resistanceOhm : null,
      material: grounding.material || null,
      crossSectionMm2: Number.isFinite(grounding.crossSectionMm2) ? grounding.crossSectionMm2 : null,
      connectedToLps: grounding.connectedToLps === true,
      connectedToPe: grounding.connectedToPe === true,
    },
    bonding: evaluateBondingPracticalModel(input),
  };

  return {
    ...model,
    qaFindings: evaluateGroundingBondingQa(model),
  };
}
