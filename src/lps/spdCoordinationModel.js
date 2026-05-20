'use strict';

const VALID_SPD_TYPES = new Set(['T1', 'T2', 'T3']);

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function createFinding(code, severity, message, details) {
  return {
    code,
    severity,
    source: 'SPD_COORDINATION_V461',
    message,
    details: details || {},
  };
}

function hasGroundingOrBonding(input) {
  if (input.grounding === true || input.bonding === true) {
    return true;
  }
  if (input.grounding && input.grounding.connected === true) {
    return true;
  }
  if (input.bonding && input.bonding.connected === true) {
    return true;
  }
  return normalizeArray(input.spdDevices).some((device) => device.grounded === true || device.bonded === true);
}

export function evaluateLpZones(lpZones) {
  const zones = normalizeArray(lpZones);
  const findings = [];

  zones.forEach((zone, index) => {
    if (!zone || !zone.id) {
      findings.push(createFinding('QA-SPD-004', 'WARN', 'LPZ zone has no identifier.', { index }));
      return;
    }

    if (index > 0) {
      const previous = zones[index - 1];
      const expectedFrom = previous && previous.id;
      if (zone.from && expectedFrom && zone.from !== expectedFrom) {
        findings.push(createFinding('QA-SPD-004', 'WARN', 'LPZ transition does not follow the previous zone.', {
          zone: zone.id,
          from: zone.from,
          expectedFrom,
        }));
      }
    }
  });

  return {
    zones,
    qaFindings: findings,
  };
}

export function evaluateSpdQa(input) {
  const data = input || {};
  const devices = normalizeArray(data.spdDevices);
  const routes = normalizeArray(data.routes || data.cableRoutes);
  const findings = [];

  const hasT1AtEntry = devices.some((device) => device.type === 'T1' && (device.location === 'building-entry' || device.location === 'main-entry'));
  if (!hasT1AtEntry) {
    findings.push(createFinding('QA-SPD-001', 'ERROR', 'Missing T1 SPD at building entry.', {}));
  }

  const hasDcSpd = devices.some((device) => device.side === 'DC' || device.circuit === 'FVE_DC' || device.location === 'pv-dc');
  if (!hasDcSpd) {
    findings.push(createFinding('QA-SPD-002', 'ERROR', 'Missing DC SPD for photovoltaic DC side.', {}));
  }

  routes.forEach((route, index) => {
    const lengthM = Number(route && route.lengthM);
    const hasSupplementarySpd = Boolean(route && route.hasSupplementarySpd);
    if (Number.isFinite(lengthM) && lengthM > 10 && !hasSupplementarySpd) {
      findings.push(createFinding('QA-SPD-003', 'WARN', 'Long route has no supplementary SPD.', {
        index,
        lengthM,
      }));
    }
  });

  findings.push(...evaluateLpZones(data.lpZones).qaFindings);

  if (!hasGroundingOrBonding(data)) {
    findings.push(createFinding('QA-SPD-005', 'ERROR', 'Missing grounding or bonding confirmation for SPD coordination.', {}));
  }

  devices.forEach((device, index) => {
    if (device.Up === undefined || device.Up === null || device.Up === '' || device.Uc === undefined || device.Uc === null || device.Uc === '') {
      findings.push(createFinding('QA-SPD-006', 'WARN', 'SPD device has missing Up or Uc value.', {
        index,
        id: device.id,
      }));
    }

    if (!VALID_SPD_TYPES.has(device.type)) {
      findings.push(createFinding('QA-SPD-007', 'ERROR', 'SPD device has invalid type.', {
        index,
        id: device.id,
        type: device.type,
      }));
    }
  });

  return findings;
}

export function evaluateSpdCoordination(input) {
  const data = input || {};
  const devices = normalizeArray(data.spdDevices);
  const lpZoneEvaluation = evaluateLpZones(data.lpZones);
  const qaFindings = evaluateSpdQa(data);

  return {
    spdDevices: devices,
    lpZones: lpZoneEvaluation.zones,
    routes: normalizeArray(data.routes || data.cableRoutes),
    qaFindings,
  };
}
