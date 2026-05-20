import { evaluateLpsAirTermination } from './lpsAirTerminationModelV582.js';
import { evaluateLpsDownConductors } from './lpsDownConductorModelV583.js';
import { evaluateLpsSeparationDistancePlaceholder } from './lpsSeparationDistancePlaceholderV584.js';
import { evaluateLpsPracticalQa } from './lpsPracticalQaModelV585.js';

export function evaluateLpsPracticalModel(input = {}) {
  const lps = input.lps || {};
  const model = {
    module: 'V581_LPS_PRACTICAL_MODEL',
    version: 'V581',
    lpsClass: lps.lpsClass || null,
    groundingLinked: lps.groundingLinked === true,
    lpz: lps.lpz || null,
    lpzClear: typeof lps.lpzClear === 'boolean' ? lps.lpzClear : Boolean(lps.lpz),
    riskPlaceholder: {
      isPlaceholder: true,
      normative: false,
      warning:
        'Placeholder LPS rizika neni finalni normovy vypocet podle norem; nesmi byt prezentovan jako finalni normovy vypocet.',
    },
    airTermination: evaluateLpsAirTermination(lps),
    downConductors: evaluateLpsDownConductors(lps),
    separationDistance: evaluateLpsSeparationDistancePlaceholder({
      separationDistance: lps.separationDistance,
      pvArray: input.pvArray,
    }),
  };

  return {
    ...model,
    qaFindings: evaluateLpsPracticalQa(model),
  };
}
