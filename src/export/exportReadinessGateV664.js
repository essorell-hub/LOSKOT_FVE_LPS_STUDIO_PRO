export function evaluateExportReadinessGateV664(exportPackage = {}) {
  const findings = exportPackage.qaSummary?.findings || [];
  const blockers = [
    ...(exportPackage.blockers || []),
    ...findings.filter((finding) => ["ERROR", "BLOCKER"].includes(String(finding.severity).toUpperCase())),
  ];
  const missing = [];
  if (!exportPackage.projectId) missing.push("projectId");
  if (!exportPackage.projectName) missing.push("projectName");
  if (!exportPackage.documents?.documentCount) missing.push("documents");
  if (!exportPackage.bom?.summary?.itemCount) missing.push("bom");
  return {
    modelVersion: "V664",
    ready: blockers.length === 0 && missing.length === 0,
    blockers,
    missing,
    warnings: exportPackage.warnings || [],
  };
}
