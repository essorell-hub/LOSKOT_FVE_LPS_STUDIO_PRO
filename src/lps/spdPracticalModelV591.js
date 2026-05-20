import { evaluateSpdAcDcModel } from './spdAcDcModelV592.js';
import { evaluateSpdCoordinationQa } from './spdCoordinationQaModelV593.js';
import { evaluateSpdLpZones } from './spdLpZoneModelV594.js';

export function evaluateSpdPracticalModel(input = {}) {
  const spd = input.spd || {};
  const devices = evaluateSpdAcDcModel(input);
  const model = {
    module: 'V591_SPD_PRACTICAL_MODEL',
    version: 'V591',
    devices,
    lpZones: evaluateSpdLpZones(input),
    longCableRun: spd.longCableRun === true,
    hasSupplementarySpd: devices.supplementary.some((device) => device.present),
    groundingLinked: spd.groundingLinked === true,
    bondingLinked: spd.bondingLinked === true,
  };

  return {
    ...model,
    qaFindings: evaluateSpdCoordinationQa(model),
  };
}
