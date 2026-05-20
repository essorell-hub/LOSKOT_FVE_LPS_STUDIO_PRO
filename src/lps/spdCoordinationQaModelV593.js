export const SPD_PRACTICAL_QA_RULES = {
  'QA-SPD-PRACT-001': 'chybi SPD T1',
  'QA-SPD-PRACT-002': 'chybi DC SPD',
  'QA-SPD-PRACT-003': 'chybi AC SPD',
  'QA-SPD-PRACT-004': 'dlouhe vedeni bez doplnkove SPD',
  'QA-SPD-PRACT-005': 'chybi Uc',
  'QA-SPD-PRACT-006': 'chybi Up',
  'QA-SPD-PRACT-007': 'spatna LPZ navaznost',
  'QA-SPD-PRACT-008': 'SPD bez uzemneni',
  'QA-SPD-PRACT-009': 'SPD bez pospojovani',
  'QA-SPD-PRACT-010': 'nejasne predjisteni SPD',
};

export function evaluateSpdCoordinationQa(model = {}) {
  const findings = [];
  const devices = [model.devices?.t1, model.devices?.ac, model.devices?.dc].filter(Boolean);
  const presentDevices = devices.filter((device) => device.present);

  addFinding(findings, model.devices?.t1?.present !== true, 'QA-SPD-PRACT-001', 'error');
  addFinding(findings, model.devices?.dc?.present !== true, 'QA-SPD-PRACT-002', 'error');
  addFinding(findings, model.devices?.ac?.present !== true, 'QA-SPD-PRACT-003', 'error');
  addFinding(
    findings,
    model.longCableRun === true && model.hasSupplementarySpd !== true,
    'QA-SPD-PRACT-004',
    'warning',
  );
  addFinding(findings, presentDevices.some((device) => !Number.isFinite(device.uc)), 'QA-SPD-PRACT-005', 'warning');
  addFinding(findings, presentDevices.some((device) => !Number.isFinite(device.up)), 'QA-SPD-PRACT-006', 'warning');
  addFinding(findings, model.lpZones?.clear !== true, 'QA-SPD-PRACT-007', 'warning');
  addFinding(findings, presentDevices.some((device) => device.connectedToPe !== true), 'QA-SPD-PRACT-008', 'error');
  addFinding(findings, presentDevices.some((device) => device.bonded !== true), 'QA-SPD-PRACT-009', 'error');
  addFinding(
    findings,
    presentDevices.some((device) => !device.backupProtection),
    'QA-SPD-PRACT-010',
    'warning',
  );

  return findings;
}

function addFinding(findings, condition, code, severity) {
  if (!condition) return;
  findings.push({
    code,
    severity,
    message: SPD_PRACTICAL_QA_RULES[code],
  });
}
