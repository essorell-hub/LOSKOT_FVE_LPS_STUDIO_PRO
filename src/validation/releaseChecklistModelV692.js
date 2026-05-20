export const RELEASE_CHECKLIST_V692 = [
  { id: "RELEASE-001", severity: "ERROR", title: "projectId is present" },
  { id: "RELEASE-002", severity: "ERROR", title: "projectName is present" },
  { id: "RELEASE-003", severity: "ERROR", title: "No ERROR QA finding exists" },
  { id: "RELEASE-004", severity: "BLOCKER", title: "No BLOCKER QA finding exists" },
  { id: "RELEASE-005", severity: "ERROR", title: "FVE part is present" },
  { id: "RELEASE-006", severity: "ERROR", title: "LPS/SPD part is present" },
  { id: "RELEASE-007", severity: "ERROR", title: "BOM exists" },
  { id: "RELEASE-008", severity: "ERROR", title: "Document package exists" },
  { id: "RELEASE-009", severity: "BLOCKER", title: "No foreign project content exists" },
  { id: "RELEASE-010", severity: "BLOCKER", title: "Placeholder calculations are non-normative" },
];

export function createReleaseChecklistV692() {
  return RELEASE_CHECKLIST_V692.map((item) => ({ ...item }));
}
