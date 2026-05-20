export const GROUNDING_BONDING_QA_RULES = {
  'QA-GND-001': 'chybi hlavni ekvipotencialni pripojnice',
  'QA-GND-002': 'chybi pospojovani FVE ramu',
  'QA-GND-003': 'chybi vazba SPD na PE/PAS',
  'QA-GND-004': 'chybi vazba LPS na uzemneni',
  'QA-GND-005': 'chybi odpor uzemneni',
  'QA-GND-006': 'chybi material',
  'QA-GND-007': 'chybi prurez',
  'QA-GND-008': 'nespojene kovove casti',
};

export function evaluateGroundingBondingQa(model = {}) {
  const findings = [];

  addFinding(
    findings,
    model.bonding?.mainEquipotentialBusbarPresent !== true,
    'QA-GND-001',
    'error',
  );
  addFinding(findings, model.bonding?.pvFramesBonded !== true, 'QA-GND-002', 'error');
  addFinding(findings, model.bonding?.spdPePasLinked !== true, 'QA-GND-003', 'error');
  addFinding(findings, model.bonding?.lpsGroundingLinked !== true, 'QA-GND-004', 'error');
  addFinding(findings, !Number.isFinite(model.grounding?.resistanceOhm), 'QA-GND-005', 'warning');
  addFinding(findings, !model.grounding?.material && !model.bonding?.material, 'QA-GND-006', 'warning');
  addFinding(
    findings,
    !Number.isFinite(model.grounding?.crossSectionMm2) && !Number.isFinite(model.bonding?.crossSectionMm2),
    'QA-GND-007',
    'warning',
  );
  addFinding(
    findings,
    Array.isArray(model.bonding?.unbondedMetalParts) && model.bonding.unbondedMetalParts.length > 0,
    'QA-GND-008',
    'error',
  );

  return findings;
}

function addFinding(findings, condition, code, severity) {
  if (!condition) return;
  findings.push({
    code,
    severity,
    message: GROUNDING_BONDING_QA_RULES[code],
  });
}
