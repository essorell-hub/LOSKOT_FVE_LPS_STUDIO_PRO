export function evaluateProjectCompletenessQaV693(project = {}) {
  const findings = [];
  if (!(project.projectId || project.id)) findings.push({ id: "RELEASE-001", severity: "ERROR", sourceModule: "project", sourceId: "projectId", message: "Missing projectId", ruleId: "RELEASE-001" });
  if (!(project.projectName || project.name)) findings.push({ id: "RELEASE-002", severity: "ERROR", sourceModule: "project", sourceId: "projectName", message: "Missing projectName", ruleId: "RELEASE-002" });
  if (!(project.fve || project.pv)) findings.push({ id: "RELEASE-005", severity: "ERROR", sourceModule: "project", sourceId: "fve", message: "Missing FVE part", ruleId: "RELEASE-005" });
  if (!(project.lps || project.spd)) findings.push({ id: "RELEASE-006", severity: "ERROR", sourceModule: "project", sourceId: "lps-spd", message: "Missing LPS/SPD part", ruleId: "RELEASE-006" });
  return findings;
}
