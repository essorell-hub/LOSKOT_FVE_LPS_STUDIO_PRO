export const LPS_PRACTICAL_QA_RULES = {
  'QA-LPS-001': 'chybi trida LPS',
  'QA-LPS-002': 'chybi jimaci soustava',
  'QA-LPS-003': 'chybi svod',
  'QA-LPS-004': 'nespojena LPS soustava',
  'QA-LPS-005': 'chybi uzemneni',
  'QA-LPS-006': 'neoverena dostatecna vzdalenost',
  'QA-LPS-007': 'kolize FVE panelu s LPS placeholderem',
  'QA-LPS-008': 'nejasna LPZ',
  'QA-LPS-009': 'placeholder riziko nesmi byt prezentovano jako finalni',
  'QA-LPS-010': 'chybi material nebo prurez',
};

export function evaluateLpsPracticalQa(model = {}) {
  const findings = [];

  addFinding(findings, !model.lpsClass, 'QA-LPS-001', 'error');
  addFinding(findings, model.airTermination?.present !== true, 'QA-LPS-002', 'error');
  addFinding(findings, model.downConductors?.present !== true, 'QA-LPS-003', 'error');
  addFinding(
    findings,
    model.airTermination?.connectedToDownConductors !== true ||
      model.downConductors?.allConnected !== true ||
      model.downConductors?.connectedToGrounding !== true,
    'QA-LPS-004',
    'error',
  );
  addFinding(findings, model.groundingLinked !== true, 'QA-LPS-005', 'error');
  addFinding(findings, model.separationDistance?.verified !== true, 'QA-LPS-006', 'warning');
  addFinding(findings, model.separationDistance?.hasCollision === true, 'QA-LPS-007', 'error');
  addFinding(findings, model.lpzClear === false || !model.lpz, 'QA-LPS-008', 'warning');
  addFinding(
    findings,
    model.separationDistance?.isPlaceholder === true && model.separationDistance?.normative !== false,
    'QA-LPS-009',
    'error',
  );
  addFinding(
    findings,
    !model.airTermination?.material ||
      !Number.isFinite(model.airTermination?.crossSectionMm2) ||
      !model.downConductors?.material ||
      !Number.isFinite(model.downConductors?.crossSectionMm2),
    'QA-LPS-010',
    'warning',
  );

  return findings;
}

function addFinding(findings, condition, code, severity) {
  if (!condition) return;
  findings.push({
    code,
    severity,
    message: LPS_PRACTICAL_QA_RULES[code],
  });
}
