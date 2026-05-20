export function evaluateSpdAcDcModel(input = {}) {
  const spd = input.spd || {};
  const ac = spd.ac || {};
  const dc = spd.dc || {};
  const t1 = spd.t1 || {};

  return {
    t1: normalizeSpdDevice(t1),
    ac: normalizeSpdDevice(ac),
    dc: normalizeSpdDevice(dc),
    supplementary: Array.isArray(spd.supplementary) ? spd.supplementary.map(normalizeSpdDevice) : [],
  };
}

function normalizeSpdDevice(device = {}) {
  return {
    present: device.present === true,
    type: device.type || null,
    uc: Number.isFinite(device.uc) ? device.uc : null,
    up: Number.isFinite(device.up) ? device.up : null,
    location: device.location || null,
    backupProtection: device.backupProtection || null,
    connectedToPe: device.connectedToPe === true,
    bonded: device.bonded === true,
  };
}
