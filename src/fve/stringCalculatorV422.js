'use strict';

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function createFinding(code, severity, message, details) {
  return {
    code,
    severity,
    source: 'FVE_STRING_V422',
    message,
    details: details || {},
  };
}

export function calculateStringElectricals(input) {
  const data = input || {};
  const moduleCount = toNumber(data.moduleCount);
  const vocStc = toNumber(data.Voc_STC);
  const vmpStc = toNumber(data.Vmp_STC);
  const iscStc = toNumber(data.Isc_STC);
  const impStc = toNumber(data.Imp_STC);
  const tempCoeffVoc = toNumber(data.tempCoeffVocPctPerC);
  const tempCoeffVmp = toNumber(data.tempCoeffVmpPctPerC);
  const minTempC = toNumber(data.minTempC, 25);
  const maxTempC = toNumber(data.maxTempC, 25);

  const vocColdModule = vocStc * (1 + (tempCoeffVoc / 100) * (minTempC - 25));
  const vmpHotModule = vmpStc * (1 + (tempCoeffVmp / 100) * (maxTempC - 25));

  return {
    vocCold: vocColdModule * moduleCount,
    vmpHot: vmpHotModule * moduleCount,
    isc: iscStc,
    imp: impStc,
    moduleCount,
  };
}

export function evaluateStringQa(electricals, inverterLimits) {
  const limits = inverterLimits || {};
  const findings = [];
  const moduleCount = toNumber(electricals && electricals.moduleCount);
  const vocCold = toNumber(electricals && electricals.vocCold);
  const vmpHot = toNumber(electricals && electricals.vmpHot);
  const isc = toNumber(electricals && electricals.isc);
  const imp = toNumber(electricals && electricals.imp);
  const maxDcVoltage = toNumber(limits.maxDcVoltage);
  const mpptMinVoltage = toNumber(limits.mpptMinVoltage);
  const mpptMaxVoltage = toNumber(limits.mpptMaxVoltage);
  const maxMpptInputCurrent = toNumber(limits.maxMpptInputCurrent);

  if (moduleCount <= 0) {
    findings.push(createFinding('QA-FVE-004', 'BLOCKER', 'String must have a positive module count.', { moduleCount }));
  }

  if (maxDcVoltage > 0 && vocCold > maxDcVoltage) {
    findings.push(createFinding('QA-FVE-002', 'ERROR', 'Cold open-circuit voltage exceeds inverter maximum DC voltage.', {
      vocCold,
      maxDcVoltage,
    }));
  }

  if ((mpptMinVoltage > 0 && vmpHot < mpptMinVoltage) || (mpptMaxVoltage > 0 && vmpHot > mpptMaxVoltage)) {
    findings.push(createFinding('QA-FVE-003', 'WARN', 'Hot MPP voltage is outside the inverter MPPT range.', {
      vmpHot,
      mpptMinVoltage,
      mpptMaxVoltage,
    }));
  }

  if (maxMpptInputCurrent > 0 && Math.max(isc, imp) > maxMpptInputCurrent) {
    findings.push(createFinding('QA-FVE-005', 'ERROR', 'String current exceeds MPPT input current limit.', {
      isc,
      imp,
      maxMpptInputCurrent,
    }));
  }

  return findings;
}

export function calculateFveStringSet(input) {
  const electricals = calculateStringElectricals(input || {});
  const qaFindings = evaluateStringQa(electricals, input && input.inverterLimits);

  return {
    vocCold: electricals.vocCold,
    vmpHot: electricals.vmpHot,
    isc: electricals.isc,
    imp: electricals.imp,
    moduleCount: electricals.moduleCount,
    qaFindings,
  };
}
